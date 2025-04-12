
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useAirdrops, useBlogPosts, useServices, useDeleteAirdrop, useDeleteBlogPost, useDeleteService } from '@/lib/supabase-hooks';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  RefreshCcw, 
  AlertCircle,
  Eye,
  Calendar,
  DollarSign,
  Clock
} from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const { data: airdrops, isLoading: isLoadingAirdrops } = useAirdrops();
  const { data: blogPosts, isLoading: isLoadingBlogPosts } = useBlogPosts();
  const { data: services, isLoading: isLoadingServices } = useServices();
  const { toast } = useToast();
  const { signOut } = useAuth();
  const deleteAirdrop = useDeleteAirdrop();
  const deleteBlogPost = useDeleteBlogPost();
  const deleteService = useDeleteService();
  
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<'airdrop' | 'blog' | 'service' | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "تم تسجيل الخروج بنجاح",
      description: "تم تسجيل خروجك من لوحة التحكم",
    });
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete || !deleteType) return;
    
    try {
      if (deleteType === 'airdrop') {
        await deleteAirdrop.mutateAsync(itemToDelete);
        toast({
          title: "تم الحذف بنجاح",
          description: "تم حذف الإيردروب بنجاح",
        });
      } else if (deleteType === 'blog') {
        await deleteBlogPost.mutateAsync(itemToDelete);
        toast({
          title: "تم الحذف بنجاح",
          description: "تم حذف المنشور بنجاح",
        });
      } else if (deleteType === 'service') {
        await deleteService.mutateAsync(itemToDelete);
        toast({
          title: "تم الحذف بنجاح",
          description: "تم حذف الخدمة بنجاح",
        });
      }
      
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ في الحذف",
        description: error.message || "حدث خطأ أثناء محاولة الحذف",
      });
    }
  };
  
  const openDeleteDialog = (id: string, type: 'airdrop' | 'blog' | 'service') => {
    setItemToDelete(id);
    setDeleteType(type);
    setIsDeleteDialogOpen(true);
  };

  const handleAddNew = (type: string) => {
    navigate(`/admin/${type}/new`);
  };

  const handleEdit = (id: string, type: string) => {
    navigate(`/admin/${type}/edit/${id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-crypto-darkBlue to-crypto-darkGray">
      <header className="bg-crypto-darkBlue/90 backdrop-blur-md border-b border-white/10 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-crypto-orange" />
            <h1 className="text-xl font-bold text-white">كريبتو بالعربي</h1>
          </div>
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="text-white hover:text-crypto-orange transition-colors flex items-center gap-2"
          >
            <span>تسجيل الخروج</span>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <Card className="mb-8 bg-crypto-darkGray/80 backdrop-blur-md border border-white/10 text-white shadow-lg">
          <CardHeader className="border-b border-white/10 pb-4">
            <CardTitle className="text-2xl font-bold text-crypto-orange">لوحة التحكم</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="airdrops" className="w-full">
              <TabsList className="mb-6 w-full bg-crypto-darkBlue/50 p-1">
                <TabsTrigger value="airdrops" className="data-[state=active]:bg-crypto-orange data-[state=active]:text-white">الإيردروب</TabsTrigger>
                <TabsTrigger value="blog" className="data-[state=active]:bg-crypto-orange data-[state=active]:text-white">المدونة</TabsTrigger>
                <TabsTrigger value="services" className="data-[state=active]:bg-crypto-orange data-[state=active]:text-white">الخدمات</TabsTrigger>
              </TabsList>
              
              <TabsContent value="airdrops" className="space-y-6 min-h-[400px]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-white">إدارة الإيردروب</h3>
                  <Button 
                    onClick={() => handleAddNew('airdrops')}
                    className="bg-crypto-orange hover:bg-crypto-orange/80 text-white flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>إضافة إيردروب جديد</span>
                  </Button>
                </div>
                
                {isLoadingAirdrops ? (
                  <div className="flex justify-center py-12">
                    <RefreshCcw className="h-8 w-8 text-crypto-orange animate-spin" />
                  </div>
                ) : airdrops?.length === 0 ? (
                  <div className="text-center py-12 text-white/70">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-white/50" />
                    <p>لا توجد إيردروب حتى الآن</p>
                    <Button 
                      onClick={() => handleAddNew('airdrops')} 
                      variant="link" 
                      className="mt-2 text-crypto-orange"
                    >
                      إضافة أول إيردروب
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {airdrops?.map((airdrop) => (
                      <Card key={airdrop.id} className="bg-crypto-darkBlue/30 border border-white/10 transition-all hover:bg-crypto-darkBlue/50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-white">{airdrop.title}</h4>
                              <p className="text-sm text-white/60 mt-1">
                                الحالة: <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                                  airdrop.status === 'active' ? 'bg-green-900/60 text-green-300' :
                                  airdrop.status === 'upcoming' ? 'bg-blue-900/60 text-blue-300' :
                                  'bg-red-900/60 text-red-300'
                                }`}>
                                  {airdrop.status === 'active' ? 'نشط' : 
                                   airdrop.status === 'upcoming' ? 'قادم' : 'منتهي'}
                                </span>
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <HoverCard>
                                <HoverCardTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-white/70 hover:text-white hover:bg-crypto-darkBlue/80"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80 bg-crypto-darkBlue border border-white/10 text-white p-4">
                                  <div className="space-y-2">
                                    <p><strong>العنوان:</strong> {airdrop.title}</p>
                                    <p><strong>الوصف:</strong> {airdrop.description || 'لا يوجد وصف'}</p>
                                    <p><strong>تاريخ النشر:</strong> {formatDate(airdrop.publish_date)}</p>
                                    <p><strong>تاريخ البداية:</strong> {airdrop.start_date ? formatDate(airdrop.start_date) : 'غير محدد'}</p>
                                    <p><strong>تاريخ النهاية:</strong> {airdrop.end_date ? formatDate(airdrop.end_date) : 'غير محدد'}</p>
                                    <p><strong>الحالة:</strong> {airdrop.status}</p>
                                  </div>
                                </HoverCardContent>
                              </HoverCard>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEdit(airdrop.id, 'airdrops')}
                                className="text-white border-white/20 hover:bg-white/10 hover:text-crypto-orange"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => openDeleteDialog(airdrop.id, 'airdrop')}
                                className="bg-red-900/60 hover:bg-red-800 text-white"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="blog" className="space-y-6 min-h-[400px]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-white">إدارة المدونة</h3>
                  <Button 
                    onClick={() => handleAddNew('blog')}
                    className="bg-crypto-orange hover:bg-crypto-orange/80 text-white flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>إضافة منشور جديد</span>
                  </Button>
                </div>
                
                {isLoadingBlogPosts ? (
                  <div className="flex justify-center py-12">
                    <RefreshCcw className="h-8 w-8 text-crypto-orange animate-spin" />
                  </div>
                ) : blogPosts?.length === 0 ? (
                  <div className="text-center py-12 text-white/70">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-white/50" />
                    <p>لا توجد منشورات حتى الآن</p>
                    <Button 
                      onClick={() => handleAddNew('blog')} 
                      variant="link" 
                      className="mt-2 text-crypto-orange"
                    >
                      إضافة أول منشور
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {blogPosts?.map((post) => (
                      <Card key={post.id} className="bg-crypto-darkBlue/30 border border-white/10 transition-all hover:bg-crypto-darkBlue/50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-white">{post.title}</h4>
                              <div className="flex items-center gap-2 text-sm text-white/60 mt-1">
                                <span>{post.author || 'غير معروف'}</span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(post.publish_date)}
                                </span>
                                {post.category && (
                                  <span className="bg-crypto-darkBlue/50 px-2 py-0.5 rounded-full text-xs">
                                    {post.category}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <HoverCard>
                                <HoverCardTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-white/70 hover:text-white hover:bg-crypto-darkBlue/80"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80 bg-crypto-darkBlue border border-white/10 text-white p-4">
                                  <div className="space-y-2">
                                    <p><strong>العنوان:</strong> {post.title}</p>
                                    <p><strong>الكاتب:</strong> {post.author || 'غير معروف'}</p>
                                    <p><strong>المستخلص:</strong> {post.excerpt || 'لا يوجد مستخلص'}</p>
                                    <p><strong>تاريخ النشر:</strong> {formatDate(post.publish_date)}</p>
                                    <p><strong>التصنيف:</strong> {post.category || 'غير مصنف'}</p>
                                    <p><strong>الرابط الثابت:</strong> {post.slug || 'غير محدد'}</p>
                                  </div>
                                </HoverCardContent>
                              </HoverCard>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEdit(post.id, 'blog')}
                                className="text-white border-white/20 hover:bg-white/10 hover:text-crypto-orange"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => openDeleteDialog(post.id, 'blog')}
                                className="bg-red-900/60 hover:bg-red-800 text-white"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="services" className="space-y-6 min-h-[400px]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-white">إدارة الخدمات</h3>
                  <Button 
                    onClick={() => handleAddNew('services')}
                    className="bg-crypto-orange hover:bg-crypto-orange/80 text-white flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>إضافة خدمة جديدة</span>
                  </Button>
                </div>
                
                {isLoadingServices ? (
                  <div className="flex justify-center py-12">
                    <RefreshCcw className="h-8 w-8 text-crypto-orange animate-spin" />
                  </div>
                ) : services?.length === 0 ? (
                  <div className="text-center py-12 text-white/70">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-white/50" />
                    <p>لا توجد خدمات حتى الآن</p>
                    <Button 
                      onClick={() => handleAddNew('services')} 
                      variant="link" 
                      className="mt-2 text-crypto-orange"
                    >
                      إضافة أول خدمة
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {services?.map((service) => (
                      <Card key={service.id} className="bg-crypto-darkBlue/30 border border-white/10 transition-all hover:bg-crypto-darkBlue/50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-white">{service.title}</h4>
                              <div className="flex items-center gap-3 text-sm text-white/60 mt-1">
                                {service.price && (
                                  <span className="flex items-center gap-1">
                                    <DollarSign className="h-3 w-3" />
                                    {service.price}
                                  </span>
                                )}
                                {service.duration && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {service.duration}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <HoverCard>
                                <HoverCardTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-white/70 hover:text-white hover:bg-crypto-darkBlue/80"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80 bg-crypto-darkBlue border border-white/10 text-white p-4">
                                  <div className="space-y-2">
                                    <p><strong>العنوان:</strong> {service.title}</p>
                                    <p><strong>الوصف:</strong> {service.description || 'لا يوجد وصف'}</p>
                                    <p><strong>السعر:</strong> {service.price || 'غير محدد'}</p>
                                    <p><strong>المدة:</strong> {service.duration || 'غير محددة'}</p>
                                    {service.image_url && (
                                      <p><strong>صورة:</strong> متوفرة</p>
                                    )}
                                  </div>
                                </HoverCardContent>
                              </HoverCard>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEdit(service.id, 'services')}
                                className="text-white border-white/20 hover:bg-white/10 hover:text-crypto-orange"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => openDeleteDialog(service.id, 'service')}
                                className="bg-red-900/60 hover:bg-red-800 text-white"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-crypto-darkGray border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-crypto-orange">تأكيد الحذف</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            هل أنت متأكد من رغبتك في حذف هذا العنصر؟ هذا الإجراء لا يمكن التراجع عنه.
          </p>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              إلغاء
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteConfirm}
              className="bg-red-900/60 hover:bg-red-800 text-white"
            >
              تأكيد الحذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
