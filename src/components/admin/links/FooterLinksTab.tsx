
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PencilIcon, PlusCircle, Trash2 } from "lucide-react";
import { FooterLink, useAddFooterLink, useDeleteFooterLink, useFooterLinks, useUpdateFooterLink } from '@/lib/hooks/useFooterLinks';
import FooterLinkDialog from './FooterLinkDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

const FooterLinksTab = () => {
  // Fetch footer links data
  const { data: footerLinks, isLoading } = useFooterLinks();
  const addFooterLink = useAddFooterLink();
  const updateFooterLink = useUpdateFooterLink();
  const deleteFooterLink = useDeleteFooterLink();
  
  // State for dialogs
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editLink, setEditLink] = useState<FooterLink | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // New link template
  const [newLink, setNewLink] = useState<Omit<FooterLink, 'id' | 'created_at' | 'updated_at'>>({
    title: '',
    url: '',
    category: 'quick_links',
    sort_order: 1
  });
  
  // Save state to localStorage when component mounts/unmounts
  useEffect(() => {
    // Load state from localStorage
    const savedState = localStorage.getItem('footerLinksTabState');
    if (savedState) {
      try {
        const { newLink: savedNewLink } = JSON.parse(savedState);
        if (savedNewLink) {
          setNewLink(savedNewLink);
        }
      } catch (e) {
        console.error('Error parsing saved footer links tab state:', e);
      }
    }
    
    // Save state to localStorage when component unmounts
    return () => {
      const stateToSave = {
        newLink
      };
      localStorage.setItem('footerLinksTabState', JSON.stringify(stateToSave));
    };
  }, [newLink]);
  
  // Handle input changes for new link
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editLink) {
      setEditLink({ ...editLink, [name]: name === 'sort_order' ? Number(value) : value });
    } else {
      setNewLink({ ...newLink, [name]: name === 'sort_order' ? Number(value) : value });
    }
  };
  
  // Handle category change
  const handleCategoryChange = (value: string) => {
    if (editLink) {
      setEditLink({ ...editLink, category: value });
    } else {
      setNewLink({ ...newLink, category: value });
    }
  };
  
  // Handle add link
  const handleAddLink = () => {
    addFooterLink.mutate(newLink, {
      onSuccess: () => {
        setIsAddDialogOpen(false);
        setNewLink({
          title: '',
          url: '',
          category: 'quick_links',
          sort_order: 1
        });
      }
    });
  };
  
  // Handle update link
  const handleUpdateLink = () => {
    if (editLink) {
      updateFooterLink.mutate(editLink, {
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
      deleteFooterLink.mutate(deleteId, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setDeleteId(null);
        }
      });
    }
  };
  
  // Group links by category
  const groupedLinks = footerLinks ? footerLinks.reduce((acc: Record<string, FooterLink[]>, link) => {
    if (!acc[link.category]) {
      acc[link.category] = [];
    }
    acc[link.category].push(link);
    return acc;
  }, {}) : {};
  
  // Category labels for display
  const categoryLabels: Record<string, string> = {
    'quick_links': 'روابط سريعة',
    'services': 'خدمات',
    'legal': 'قانوني'
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">روابط التذييل</h2>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.keys(groupedLinks).map((category) => (
            <Card key={category} className="bg-crypto-darkGray/80 backdrop-blur-md border border-white/10 text-white shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-crypto-orange">{categoryLabels[category] || category}</CardTitle>
                <CardDescription className="text-gray-400">روابط {categoryLabels[category] || category}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {groupedLinks[category].sort((a, b) => a.sort_order - b.sort_order).map((link) => (
                    <li key={link.id} className="flex items-center justify-between p-2 rounded-md hover:bg-crypto-darkBlue/20">
                      <div>
                        <p className="font-medium">{link.title}</p>
                        <p className="text-sm text-gray-400">{link.url}</p>
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
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Add/Edit Link Dialog */}
      <FooterLinkDialog
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
        onCategoryChange={handleCategoryChange}
        onSubmit={editLink ? handleUpdateLink : handleAddLink}
        isPending={editLink ? updateFooterLink.isPending : addFooterLink.isPending}
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onConfirm={handleDeleteLink}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setDeleteId(null);
        }}
        type="footer"
      />
    </div>
  );
};

export default FooterLinksTab;
