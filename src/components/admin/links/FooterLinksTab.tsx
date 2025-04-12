
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Plus } from "lucide-react";
import { FooterLink, useFooterLinks, useAddFooterLink, useUpdateFooterLink, useDeleteFooterLink } from '@/lib/hooks/useFooterLinks';
import FooterLinkDialog from './FooterLinkDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

const FooterLinksTab: React.FC = () => {
  const { data: footerLinks, isLoading } = useFooterLinks();
  const addFooterLink = useAddFooterLink();
  const updateFooterLink = useUpdateFooterLink();
  const deleteFooterLink = useDeleteFooterLink();
  
  const [newFooterLink, setNewFooterLink] = useState<Omit<FooterLink, 'id' | 'created_at' | 'updated_at'>>({
    title: '',
    url: '',
    category: 'quick_links',
    sort_order: 0
  });
  
  const [editFooterLink, setEditFooterLink] = useState<FooterLink | null>(null);
  const [isFooterLinkDialogOpen, setIsFooterLinkDialogOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
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
  
  const confirmDelete = () => {
    if (linkToDelete) {
      deleteFooterLink.mutate(linkToDelete);
      setLinkToDelete(null);
      setIsDeleteDialogOpen(false);
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
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-crypto-orange"></div>
      </div>
    );
  }
  
  return (
    <Card className="bg-crypto-darkGray/80 backdrop-blur-md border border-white/10 text-white shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-crypto-orange">روابط التذييل</CardTitle>
          <CardDescription className="text-gray-400">قم بإدارة روابط تذييل الموقع</CardDescription>
        </div>
        <Button 
          onClick={() => {
            setEditFooterLink(null);
            setNewFooterLink({
              title: '',
              url: '',
              category: 'quick_links',
              sort_order: 0
            });
            setIsFooterLinkDialogOpen(true);
          }}
          className="bg-crypto-orange hover:bg-crypto-orange/90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          إضافة رابط جديد
        </Button>
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
              <h3 className="text-lg font-medium mb-4 text-crypto-orange">{categoryLabels[category as keyof typeof categoryLabels]}</h3>
              {links.length === 0 ? (
                <p className="text-gray-400 text-center py-4">لا توجد روابط في هذا التصنيف</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-crypto-darkBlue/30">
                        <TableHead className="text-right text-crypto-orange">العنوان</TableHead>
                        <TableHead className="text-right text-crypto-orange">الرابط</TableHead>
                        <TableHead className="text-right text-crypto-orange">الترتيب</TableHead>
                        <TableHead className="text-right text-crypto-orange">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {links.map(link => (
                        <TableRow key={link.id} className="border-white/10 hover:bg-crypto-darkBlue/30">
                          <TableCell className="text-white">{link.title}</TableCell>
                          <TableCell>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-crypto-orange hover:underline">
                              {link.url}
                            </a>
                          </TableCell>
                          <TableCell className="text-white">{link.sort_order}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2 space-x-reverse">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setEditFooterLink(link);
                                  setIsFooterLinkDialogOpen(true);
                                }}
                                className="text-white hover:text-crypto-orange hover:bg-white/10"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setLinkToDelete(link.id);
                                  setIsDeleteDialogOpen(true);
                                }}
                                className="text-white hover:text-red-500 hover:bg-white/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
      
      <FooterLinkDialog 
        isOpen={isFooterLinkDialogOpen}
        onOpenChange={setIsFooterLinkDialogOpen}
        editLink={editFooterLink}
        newLink={newFooterLink}
        onInputChange={handleFooterLinkInputChange}
        onCategoryChange={handleFooterLinkCategoryChange}
        onSubmit={editFooterLink ? handleUpdateFooterLink : handleAddFooterLink}
        isPending={addFooterLink.isPending || updateFooterLink.isPending}
      />
      
      <DeleteConfirmationDialog 
        isOpen={isDeleteDialogOpen}
        onConfirm={confirmDelete}
        onCancel={() => {
          setLinkToDelete(null);
          setIsDeleteDialogOpen(false);
        }}
        type="footer"
      />
    </Card>
  );
};

export default FooterLinksTab;
