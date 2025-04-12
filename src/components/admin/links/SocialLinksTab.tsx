
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Plus } from "lucide-react";
import { SocialLink, useSocialLinks, useAddSocialLink, useUpdateSocialLink, useDeleteSocialLink } from '@/lib/hooks/useSocialLinks';
import SocialLinkDialog from './SocialLinkDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

const SocialLinksTab: React.FC = () => {
  const { data: socialLinks, isLoading } = useSocialLinks();
  const addSocialLink = useAddSocialLink();
  const updateSocialLink = useUpdateSocialLink();
  const deleteSocialLink = useDeleteSocialLink();
  
  const [newSocialLink, setNewSocialLink] = useState<Omit<SocialLink, 'id' | 'created_at' | 'updated_at'>>({
    platform: '',
    url: '',
    icon: ''
  });
  
  const [editSocialLink, setEditSocialLink] = useState<SocialLink | null>(null);
  const [isSocialLinkDialogOpen, setIsSocialLinkDialogOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
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
    if (linkToDelete) {
      deleteSocialLink.mutate(linkToDelete);
      setLinkToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };
  
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
          <CardTitle className="text-crypto-orange">روابط التواصل الاجتماعي</CardTitle>
          <CardDescription className="text-gray-400">قم بإدارة روابط التواصل الاجتماعي</CardDescription>
        </div>
        <Button 
          onClick={() => {
            setEditSocialLink(null);
            setNewSocialLink({
              platform: '',
              url: '',
              icon: ''
            });
            setIsSocialLinkDialogOpen(true);
          }}
          className="bg-crypto-orange hover:bg-crypto-orange/90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          إضافة رابط جديد
        </Button>
      </CardHeader>
      <CardContent>
        {socialLinks?.length === 0 ? (
          <p className="text-gray-400 text-center py-4">لا توجد روابط تواصل اجتماعي</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-crypto-darkBlue/30">
                  <TableHead className="text-right text-crypto-orange">المنصة</TableHead>
                  <TableHead className="text-right text-crypto-orange">الرابط</TableHead>
                  <TableHead className="text-right text-crypto-orange">الأيقونة</TableHead>
                  <TableHead className="text-right text-crypto-orange">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {socialLinks?.map(link => (
                  <TableRow key={link.id} className="border-white/10 hover:bg-crypto-darkBlue/30">
                    <TableCell className="text-white">{link.platform}</TableCell>
                    <TableCell>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-crypto-orange hover:underline">
                        {link.url}
                      </a>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center w-10 h-10 bg-crypto-darkBlue rounded-md text-white">
                        <div dangerouslySetInnerHTML={{ __html: link.icon }} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2 space-x-reverse">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setEditSocialLink(link);
                            setIsSocialLinkDialogOpen(true);
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
      </CardContent>
      
      <SocialLinkDialog 
        isOpen={isSocialLinkDialogOpen}
        onOpenChange={setIsSocialLinkDialogOpen}
        editLink={editSocialLink}
        newLink={newSocialLink}
        onInputChange={handleSocialLinkInputChange}
        onSubmit={editSocialLink ? handleUpdateSocialLink : handleAddSocialLink}
        isPending={addSocialLink.isPending || updateSocialLink.isPending}
      />
      
      <DeleteConfirmationDialog 
        isOpen={isDeleteDialogOpen}
        onConfirm={confirmDelete}
        onCancel={() => {
          setLinkToDelete(null);
          setIsDeleteDialogOpen(false);
        }}
        type="social"
      />
    </Card>
  );
};

export default SocialLinksTab;
