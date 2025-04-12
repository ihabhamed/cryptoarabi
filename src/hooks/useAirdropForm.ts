
import { useState, useEffect } from 'react';
import { useAirdrop, useAddAirdrop, useUpdateAirdrop } from "@/lib/hooks";
import { toast } from "@/lib/utils/toast-utils";
import { NewAirdrop } from '@/types/supabase';
import { useAirdropImage } from '@/hooks/useAirdropImage';
import { useAirdropLink } from '@/hooks/useAirdropLink';
import { formatAirdropData, validateAirdropData } from '@/lib/utils/airdropFormUtils';
import { saveFormData, clearFormData, getFormData, getStorageKey } from '@/lib/utils/formStorage';

interface UseAirdropFormProps {
  id?: string;
  onSuccess?: () => void;
}

export function useAirdropForm({ id, onSuccess }: UseAirdropFormProps) {
  const isEditMode = !!id;
  const { data: existingAirdrop, isLoading } = useAirdrop(id);
  const addAirdrop = useAddAirdrop();
  const updateAirdrop = useUpdateAirdrop();
  const { linkCopied, copyAirdropLink: baseCopyAirdropLink } = useAirdropLink();
  
  // Create a wrapper function that passes the ID to copyAirdropLink
  const copyAirdropLink = () => {
    if (id) {
      baseCopyAirdropLink(id);
    } else {
      baseCopyAirdropLink();
    }
  };
  
  const [formData, setFormData] = useState<NewAirdrop>({
    title: '',
    description: '',
    status: 'upcoming',
    twitter_link: '',
    youtube_link: '',
    claim_url: '',
    start_date: '',
    end_date: '',
    image_url: '',
    publish_date: new Date().toISOString()
  });
  
  const {
    uploadingImage,
    previewUrl,
    handleImageChange,
    handleImageUrlChange: handleImageUrlChangeBase,
    handleRemoveImage: handleRemoveImageBase,
    uploadSelectedImage
  } = useAirdropImage({ 
    initialImageUrl: isEditMode && existingAirdrop?.image_url ? existingAirdrop.image_url : null 
  });
  
  // Custom handlers that pass the state setter
  const handleImageUrlChange = (url: string) => handleImageUrlChangeBase(url, setFormData);
  const handleRemoveImage = () => handleRemoveImageBase(setFormData);
  
  // Load data from localStorage or API
  useEffect(() => {
    const loadFormData = async () => {
      const storageKey = getStorageKey(isEditMode, id);
      
      if (isEditMode && existingAirdrop) {
        // For edit mode, use the data from useAirdrop hook
        const airdropData = formatAirdropData(existingAirdrop);
        setFormData(airdropData);
        
        // Save to localStorage in edit mode with unique key
        saveFormData(storageKey, { ...airdropData, id });
      } else if (!isEditMode) {
        // For new entry, check localStorage
        const savedData = getFormData<NewAirdrop & { id?: string }>(storageKey);
        
        if (savedData) {
          setFormData({
            title: savedData.title || '',
            description: savedData.description || '',
            status: savedData.status || 'upcoming',
            twitter_link: savedData.twitter_link || '',
            youtube_link: savedData.youtube_link || '',
            claim_url: savedData.claim_url || '',
            start_date: savedData.start_date || '',
            end_date: savedData.end_date || '',
            image_url: savedData.image_url || '',
            publish_date: savedData.publish_date || new Date().toISOString()
          });
        }
      }
    };
    
    loadFormData();
  }, [existingAirdrop, id, isEditMode]);
  
  // Save form data to localStorage whenever it changes
  useEffect(() => {
    // Only save if there's actual data
    if (formData.title) {
      const storageKey = getStorageKey(isEditMode, id);
      saveFormData(storageKey, { ...formData, id });
    }
  }, [formData, id, isEditMode]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      const validationError = validateAirdropData(formData);
      if (validationError) {
        throw new Error(validationError);
      }
      
      let finalFormData = { ...formData };
      
      // Upload image if selected
      const imageUrl = await uploadSelectedImage();
      if (imageUrl) {
        finalFormData = { ...finalFormData, image_url: imageUrl };
      }
      
      if (isEditMode && id) {
        await updateAirdrop.mutateAsync({
          id,
          ...finalFormData
        });
        toast({
          title: "تم التحديث بنجاح",
          description: "تم تحديث الإيردروب بنجاح",
        });
      } else {
        await addAirdrop.mutateAsync(finalFormData);
        toast({
          title: "تمت الإضافة بنجاح",
          description: "تم إضافة الإيردروب بنجاح",
        });
      }
      
      // Clear form data after successful submission
      const storageKey = getStorageKey(isEditMode, id);
      clearFormData(storageKey);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: error.message || "حدث خطأ أثناء حفظ الإيردروب",
      });
    }
  };

  return {
    formData,
    isLoading,
    isEditMode,
    uploadingImage,
    previewUrl,
    linkCopied,
    handleChange,
    handleSelectChange,
    handleImageChange,
    handleImageUrlChange,
    handleRemoveImage,
    handleSubmit,
    copyAirdropLink,
    isSaving: addAirdrop.isPending || updateAirdrop.isPending
  };
}
