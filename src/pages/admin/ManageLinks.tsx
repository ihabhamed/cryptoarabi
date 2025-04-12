
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Link2, Edit, Trash2, Plus, Link } from "lucide-react";
import { useFooterLinks, useAddFooterLink, useUpdateFooterLink, useDeleteFooterLink, FooterLink } from '@/lib/hooks/useFooterLinks';
import { useSocialLinks, useAddSocialLink, useUpdateSocialLink, useDeleteSocialLink, SocialLink } from '@/lib/hooks/useSocialLinks';
import AdminLayout from '@/components/admin/AdminLayout';

const ManageLinks = () => {
  const { user, loading, isAdmin } = useAuth();
  const { data: footerLinks, isLoading: isLoadingFooterLinks } = useFooterLinks();
  const { data: socialLinks, isLoading: isLoadingSocialLinks } = useSocialLinks();
  
  const addFooterLink = useAddFooterLink();
  const updateFooterLink = useUpdateFooterLink();
  const deleteFooterLink = useDeleteFooterLink();
  
  const addSocialLink = useAddSocialLink();
  const updateSocialLink = useUpdateSocialLink();
  const deleteSocialLink = useDeleteSocialLink();
  
  const [newFooterLink, setNewFooterLink] = useState<Omit<FooterLink, 'id' | 'created_at' | 'updated_at'>>({
    title: '',
    url: '',
    category: 'quick_links',
    sort_order: 0
  });
  
  const [editFooterLink, setEditFooterLink] = useState<FooterLink | null>(null);
  
  const [newSocialLink, setNewSocialLink] = useState<Omit<SocialLink, 'id' | 'created_at' | 'updated_at'>>({
    platform: '',
    url: '',
    icon: ''
  });
  
  const [editSocialLink, setEditSocialLink] = useState<SocialLink | null>(null);
  
  const [isFooterLinkDialogOpen, setIsFooterLinkDialogOpen] = useState(false);
  const [isSocialLinkDialogOpen, setIsSocialLinkDialogOpen] = useState(false);
  
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);
  const [linkTypeToDelete, setLinkTypeToDelete] = useState<'footer' | 'social' | null>(null);
  
  if (loading || isLoadingFooterLinks || isLoadingSocialLinks) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-crypto-darkBlue">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-crypto-orange"></div>
      </div>
    );
  }
  
  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  
  const handleFooterLinkInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editFooterLink) {
      setEditFooterLink({
        ...editFooterLink,
        [name]: name === 'sort_order' ? parseInt(value) : value
      });
    } else {
      setNewFooterLink({
        ...newFooterLink,
        [name]: name === 'sort_order' ? parseInt(value) : value
      });
    }
  };
  
  const handleFooterLinkCategoryChange = (value: string) => {
    if (editFooterLink) {
      setEditFooterLink({
        ...editFooterLink,
        category: value
      });
    } else {
      setNewFooterLink({
        ...newFooterLink,
        category: value
      });
    }
  };
  
  const handleSocialLinkInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editSocialLink) {
      setEditSocialLink({
        ...editSocialLink,
        [name]: value
      });
    } else {
      setNewSocialLink({
        ...newSocialLink,
        [name]: value
      });
    }
  };
  
  const handleAddFooterLink = () => {
    addFooterLink.mutate(newFooterLink, {
      onSuccess: () => {
        setNewFooterLink({
          title: '',
          url: '',
          category: 'quick_links',
          sort_order: 0
        });
        setIsFooterLinkDialogOpen(false);
      }
    });
  };
  
  const handleUpdateFooterLink = () => {
    if (editFooterLink) {
      updateFooterLink.mutate(editFooterLink, {
        onSuccess: () => {
          setEditFooterLink(null);
          setIsFooterLinkDialogOpen(false);
        }
      });
    }
  };
  
  const handleAddSocialLink = () => {
    addSocialLink.mutate(newSocialLink, {
      onSuccess: () => {
        setNewSocialLink({
          platform: '',
          url: '',
          icon: ''
        });
        setIsSocialLinkDialogOpen(false);
      }
    });
  };
  
  const handleUpdateSocialLink = () => {
    if (editSocialLink) {
      updateSocialLink.mutate(editSocialLink, {
        onSuccess: () => {
          setEditSocialLink(null);
          setIsSocialLinkDialogOpen(false);
        }
      });
    }
  };
  
  const confirmDelete = () => {
    if (linkToDelete && linkTypeToDelete) {
      if (linkTypeToDelete === 'footer') {
        deleteFooterLink.mutate(linkToDelete);
      } else {
        deleteSocialLink.mutate(linkToDelete);
      }
      setLinkToDelete(null);
      setLinkTypeToDelete(null);
    }
  };

  const categoryLabels = {
    'quick_links': 'روابط سريعة',
    'services': 'خدمات',
    'legal': 'قانوني'
  };
  
  // Group footer links by category for display
  const quickLinks = footerLinks?.filter(link => link.category === 'quick_links').sort((a, b) => a.sort_order - b.sort_order) || [];
  const serviceLinks = footerLinks?.filter(link => link.category === 'services').sort((a, b) => a.sort_order - b.sort_order) || [];
  const legalLinks = footerLinks?.filter(link => link.category === 'legal').sort((a, b) => a.sort_order - b.sort_order) || [];
  
  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">إدارة الروابط</h1>
          <p className="text-gray-500">قم بإدارة روابط التذييل والروابط الاجتماعية</p>
        </div>
        
        <Tabs defaultValue="footer">
          <TabsList className="mb-8 border border-gray-200 rounded-lg p-1 bg-white">
            <TabsTrigger value="footer" className="flex items-center gap-2">
              <Link2 size={16} />
              <span>روابط التذييل</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Link size={16} />
              <span>روابط التواصل الاجتماعي</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="footer">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>روابط التذييل</CardTitle>
                  <CardDescription>قم بإدارة روابط تذييل الموقع</CardDescription>
                </div>
                <Dialog open={isFooterLinkDialogOpen} onOpenChange={setIsFooterLinkDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => {
                        setEditFooterLink(null);
                        setNewFooterLink({
                          title: '',
                          url: '',
                          category: 'quick_links',
                          sort_order: 0
                        });
                      }}
                      className="bg-crypto-orange hover:bg-crypto-orange/90 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      إضافة رابط جديد
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editFooterLink ? 'تعديل الرابط' : 'إضافة رابط جديد'}</DialogTitle>
                      <DialogDescription>
                        {editFooterLink 
                          ? 'قم بتعديل معلومات الرابط' 
                          : 'قم بإدخال معلومات الرابط الجديد'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">عنوان الرابط</Label>
                        <Input 
                          id="title" 
                          name="title"
                          value={editFooterLink ? editFooterLink.title : newFooterLink.title} 
                          onChange={handleFooterLinkInputChange}
                          placeholder="الرئيسية" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="url">رابط URL</Label>
                        <Input 
                          id="url" 
                          name="url"
                          value={editFooterLink ? editFooterLink.url : newFooterLink.url} 
                          onChange={handleFooterLinkInputChange}
                          placeholder="/home" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">التصنيف</Label>
                        <Select 
                          onValueChange={handleFooterLinkCategoryChange}
                          defaultValue={editFooterLink ? editFooterLink.category : newFooterLink.category}
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="اختر التصنيف" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="quick_links">روابط سريعة</SelectItem>
                            <SelectItem value="services">خدمات</SelectItem>
                            <SelectItem value="legal">قانوني</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sort_order">ترتيب العرض</Label>
                        <Input 
                          id="sort_order" 
                          name="sort_order"
                          type="number"
                          value={editFooterLink ? editFooterLink.sort_order : newFooterLink.sort_order} 
                          onChange={handleFooterLinkInputChange}
                          placeholder="1" 
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setIsFooterLinkDialogOpen(false)}
                      >
                        إلغاء
                      </Button>
                      <Button 
                        type="button"
                        className="bg-crypto-orange hover:bg-crypto-orange/90 text-white"
                        onClick={editFooterLink ? handleUpdateFooterLink : handleAddFooterLink}
                        disabled={addFooterLink.isPending || updateFooterLink.isPending}
                      >
                        {addFooterLink.isPending || updateFooterLink.isPending 
                          ? 'جاري الحفظ...' 
                          : editFooterLink ? 'تحديث' : 'إضافة'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {['quick_links', 'services', 'legal'].map(category => {
                  const links = category === 'quick_links' 
                    ? quickLinks 
                    : category === 'services' 
                      ? serviceLinks 
                      : legalLinks;
                  
                  return (
                    <div key={category} className="mb-8">
                      <h3 className="text-lg font-medium mb-4">{categoryLabels[category as keyof typeof categoryLabels]}</h3>
                      {links.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">لا توجد روابط في هذا التصنيف</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="px-4 py-2 text-right">العنوان</th>
                                <th className="px-4 py-2 text-right">الرابط</th>
                                <th className="px-4 py-2 text-right">الترتيب</th>
                                <th className="px-4 py-2 text-right">الإجراءات</th>
                              </tr>
                            </thead>
                            <tbody>
                              {links.map(link => (
                                <tr key={link.id} className="border-b hover:bg-gray-50">
                                  <td className="px-4 py-3">{link.title}</td>
                                  <td className="px-4 py-3">
                                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                      {link.url}
                                    </a>
                                  </td>
                                  <td className="px-4 py-3">{link.sort_order}</td>
                                  <td className="px-4 py-3">
                                    <div className="flex space-x-2 space-x-reverse">
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => {
                                          setEditFooterLink(link);
                                          setIsFooterLinkDialogOpen(true);
                                        }}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={() => {
                                              setLinkToDelete(link.id);
                                              setLinkTypeToDelete('footer');
                                            }}
                                          >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              هذا الإجراء لا يمكن التراجع عنه. سيتم حذف الرابط نهائيًا.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                            <AlertDialogAction
                                              className="bg-red-500 hover:bg-red-600 text-white"
                                              onClick={confirmDelete}
                                            >
                                              حذف
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="social">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>روابط التواصل الاجتماعي</CardTitle>
                  <CardDescription>قم بإدارة روابط التواصل الاجتماعي</CardDescription>
                </div>
                <Dialog open={isSocialLinkDialogOpen} onOpenChange={setIsSocialLinkDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => {
                        setEditSocialLink(null);
                        setNewSocialLink({
                          platform: '',
                          url: '',
                          icon: ''
                        });
                      }}
                      className="bg-crypto-orange hover:bg-crypto-orange/90 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      إضافة رابط جديد
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editSocialLink ? 'تعديل رابط التواصل الاجتماعي' : 'إضافة رابط تواصل اجتماعي جديد'}</DialogTitle>
                      <DialogDescription>
                        {editSocialLink 
                          ? 'قم بتعديل معلومات رابط التواصل الاجتماعي' 
                          : 'قم بإدخال معلومات رابط التواصل الاجتماعي الجديد'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="platform">المنصة</Label>
                        <Input 
                          id="platform" 
                          name="platform"
                          value={editSocialLink ? editSocialLink.platform : newSocialLink.platform} 
                          onChange={handleSocialLinkInputChange}
                          placeholder="Twitter, Facebook, Instagram..." 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="url">رابط URL</Label>
                        <Input 
                          id="url" 
                          name="url"
                          value={editSocialLink ? editSocialLink.url : newSocialLink.url} 
                          onChange={handleSocialLinkInputChange}
                          placeholder="https://twitter.com/username" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="icon">رمز SVG للأيقونة</Label>
                        <textarea 
                          id="icon" 
                          name="icon"
                          value={editSocialLink ? editSocialLink.icon : newSocialLink.icon} 
                          onChange={handleSocialLinkInputChange}
                          placeholder='<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">...</svg>' 
                          rows={5}
                          className="flex h-20 min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setIsSocialLinkDialogOpen(false)}
                      >
                        إلغاء
                      </Button>
                      <Button 
                        type="button"
                        className="bg-crypto-orange hover:bg-crypto-orange/90 text-white"
                        onClick={editSocialLink ? handleUpdateSocialLink : handleAddSocialLink}
                        disabled={addSocialLink.isPending || updateSocialLink.isPending}
                      >
                        {addSocialLink.isPending || updateSocialLink.isPending 
                          ? 'جاري الحفظ...' 
                          : editSocialLink ? 'تحديث' : 'إضافة'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {socialLinks?.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">لا توجد روابط تواصل اجتماعي</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-4 py-2 text-right">المنصة</th>
                          <th className="px-4 py-2 text-right">الرابط</th>
                          <th className="px-4 py-2 text-right">الأيقونة</th>
                          <th className="px-4 py-2 text-right">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {socialLinks?.map(link => (
                          <tr key={link.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3">{link.platform}</td>
                            <td className="px-4 py-3">
                              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {link.url}
                              </a>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-md">
                                <div dangerouslySetInnerHTML={{ __html: link.icon }} />
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex space-x-2 space-x-reverse">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => {
                                    setEditSocialLink(link);
                                    setIsSocialLinkDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => {
                                        setLinkToDelete(link.id);
                                        setLinkTypeToDelete('social');
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        هذا الإجراء لا يمكن التراجع عنه. سيتم حذف رابط التواصل الاجتماعي نهائيًا.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                      <AlertDialogAction
                                        className="bg-red-500 hover:bg-red-600 text-white"
                                        onClick={confirmDelete}
                                      >
                                        حذف
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ManageLinks;
