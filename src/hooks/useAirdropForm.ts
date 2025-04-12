
import { useState } from 'react';
import { useAirdrop } from "@/lib/hooks";
import { formatAirdropData } from '@/lib/utils/airdropFormUtils';
import { useAirdropImage } from '@/hooks/useAirdropImage';
import { useAirdropLink } from '@/hooks/useAirdropLink';
import { useAirdropMetaGeneration } from '@/hooks/useAirdropMetaGeneration';
import { useAirdropStorage } from '@/hooks/airdrop/useAirdropStorage';
import { useAirdropFormHandlers } from '@/hooks/airdrop/useAirdropFormHandlers';
import { useAirdropSubmission } from '@/hooks/airdrop/useAirdropSubmission';

interface UseAirdropFormProps {
  id?: string;
  onSuccess?: () => void;
}

export function useAirdropForm({ id, onSuccess }: UseAirdropFormProps) {
  const isEditMode = !!id;
  const { data: existingAirdrop, isLoading } = useAirdrop(id);
  const { linkCopied, copyAirdropLink: baseCopyAirdropLink } = useAirdropLink();
  
  // Create a wrapper function that passes the ID to copyAirdropLink
  const copyAirdropLink = () => {
    if (id) {
      baseCopyAirdropLink(id);
    } else {
      baseCopyAirdropLink();
    }
  };

  // Get formatted data for storage
  const formattedAirdropData = existingAirdrop ? formatAirdropData(existingAirdrop) : undefined;
  
  // Use the storage hook
  const {
    formData,
    setFormData,
    clearAirdropFormData
  } = useAirdropStorage({
    id,
    isEditMode,
    initialData: formattedAirdropData
  });

  // Use the form handlers hook
  const { handleChange, handleSelectChange } = useAirdropFormHandlers(setFormData);
  
  // Use the image management hook
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
  
  // Use the meta generation hook
  const {
    isGeneratingMeta,
    isGeneratingHashtags,
    generateMetaContent,
    generateHashtagsContent
  } = useAirdropMetaGeneration({
    formData,
    setFormData
  });
  
  // Use the submission hook
  const { handleSubmit: submitForm, isSaving } = useAirdropSubmission({
    id,
    onSuccess,
    clearAirdropFormData
  });

  // Create the main handleSubmit function that combines the pieces
  const handleSubmit = (e: React.FormEvent) => {
    submitForm(e, formData, uploadSelectedImage);
  };

  return {
    formData,
    isLoading,
    isEditMode,
    uploadingImage,
    previewUrl,
    linkCopied,
    isGeneratingMeta,
    isGeneratingHashtags,
    handleChange,
    handleSelectChange,
    handleImageChange,
    handleImageUrlChange,
    handleRemoveImage,
    handleSubmit,
    copyAirdropLink,
    generateMetaContent,
    generateHashtagsContent,
    isSaving
  };
}
