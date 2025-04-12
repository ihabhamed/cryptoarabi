
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PencilIcon, PlusCircle, Trash2 } from "lucide-react";
import { SocialLink, useAddSocialLink, useDeleteSocialLink, useSocialLinks, useUpdateSocialLink } from '@/lib/hooks/useSocialLinks';
import SocialLinkDialog from './SocialLinkDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

const SocialLinksTab = () => {
  // Fetch social links data
  const { data: socialLinks, isLoading } = useSocialLinks();
  const addSocialLink = useAddSocialLink();
  const updateSocialLink = useUpdateSocialLink();
  const deleteSocialLink = useDeleteSocialLink();
  
  // State for dialogs
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editLink, setEditLink] = useState<SocialLink | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // New link template
  const [newLink, setNewLink] = useState<Omit<SocialLink, 'id' | 'created_at' | 'updated_at'>>({
    platform: '',
    url: '',
    icon: ''
  });
  
  // Save state to localStorage when component mounts/unmounts
  useEffect(() => {
    // Load state from localStorage
    const savedState = localStorage.getItem('socialLinksTabState');
    if (savedState) {
      try {
        const { newLink: savedNewLink } = JSON.parse(savedState);
        if (savedNewLink) {
          setNewLink(savedNewLink);
        }
      } catch (e) {
        console.error('Error parsing saved social links tab state:', e);
      }
    }
    
    // Save state to localStorage when component unmounts
    return () => {
      const stateToSave = {
        newLink
      };
      localStorage.setItem('socialLinksTabState', JSON.stringify(stateToSave));
    };
  }, [newLink]);
  
  // Handle input changes for new link
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editLink) {
      setEditLink({ ...editLink, [name]: value });
    } else {
      setNewLink({ ...newLink, [name]: value });
    }
  };
  
  // Handle add link
  const handleAddLink = () => {
    addSocialLink.mutate(newLink, {
      onSuccess: () => {
        setIsAddDialogOpen(false);
        setNewLink({
          platform: '',
          url: '',
          icon: ''
        });
      }
    });
  };
  
  // Handle update link
  const handleUpdateLink = () => {
    if (editLink) {
      updateSocialLink.mutate(editLink, {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          setEditLink(null);
        }
      });
    }
  };
  
  // Handle delete link
  const handleDeleteLink = () => {
    if (deleteId) {
      deleteSocialLink.mutate(deleteId, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setDeleteId(null);
        }
      });
    }
  };
  
  // Icon map for common social platforms
  const getIconClass = (platform: string, icon: string) => {
    const lowercasePlatform = platform.toLowerCase();
    if (lowercasePlatform.includes('twitter') || lowercasePlatform.includes('x')) return 'i-lucide-twitter';
    if (lowercasePlatform.includes('facebook')) return 'i-lucide-facebook';
    if (lowercasePlatform.includes('instagram')) return 'i-lucide-instagram';
    if (lowercasePlatform.includes('linkedin')) return 'i-lucide-linkedin';
    if (lowercasePlatform.includes('youtube')) return 'i-lucide-youtube';
    if (lowercasePlatform.includes('github')) return 'i-lucide-github';
    if (lowercasePlatform.includes('telegram')) return 'i-lucide-send';
    if (lowercasePlatform.includes('discord')) return 'i-lucide-message-circle';
    // If no match, use the provided icon or default
    return icon || 'i-lucide-link';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">روابط التواصل الاجتماعي</h2>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-crypto-orange hover:bg-crypto-orange/90 text-white"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          إضافة رابط جديد
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-crypto-orange"></div>
        </div>
      ) : (
        <Card className="bg-crypto-darkGray/80 backdrop-blur-md border border-white/10 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {socialLinks?.map((link) => (
                <div 
                  key={link.id} 
                  className="flex items-center justify-between p-4 rounded-md bg-crypto-darkBlue/30 border border-white/10"
                >
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-crypto-orange/20 flex items-center justify-center">
                      <span className={`${getIconClass(link.platform, link.icon)} h-5 w-5 text-crypto-orange`}></span>
                    </div>
                    <div>
                      <p className="font-medium">{link.platform}</p>
                      <p className="text-sm text-gray-400 truncate max-w-[150px]">{link.url}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditLink(link);
                        setIsEditDialogOpen(true);
                      }}
                      className="h-8 w-8 text-gray-400 hover:text-white hover:bg-crypto-darkBlue/50"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setDeleteId(link.id);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {(!socialLinks || socialLinks.length === 0) && (
              <div className="text-center py-8 text-gray-400">
                <p>لا توجد روابط تواصل اجتماعي بعد</p>
                <p className="text-sm mt-2">انقر على "إضافة رابط جديد" لإضافة أول رابط</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Add/Edit Link Dialog */}
      <SocialLinkDialog
        isOpen={isAddDialogOpen || isEditDialogOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            if (isAddDialogOpen) setIsAddDialogOpen(false);
            if (isEditDialogOpen) {
              setIsEditDialogOpen(false);
              setEditLink(null);
            }
          }
        }}
        editLink={editLink}
        newLink={newLink}
        onInputChange={handleInputChange}
        onSubmit={editLink ? handleUpdateLink : handleAddLink}
        isPending={editLink ? updateSocialLink.isPending : addSocialLink.isPending}
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onConfirm={handleDeleteLink}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setDeleteId(null);
        }}
        type="social"
      />
    </div>
  );
};

export default SocialLinksTab;
