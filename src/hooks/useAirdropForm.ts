
import { useState } from 'react';
import { useAirdrop } from "@/lib/hooks";
import { formatAirdropData } from '@/lib/utils/airdropFormUtils';
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

  // Create the main handleSubmit function
  const handleSubmit = (e: React.FormEvent) => {
    submitForm(e, formData);
  };

  return {
    formData,
    isLoading,
    isEditMode,
    linkCopied,
    isGeneratingMeta,
    isGeneratingHashtags,
    handleChange,
    handleSelectChange,
    handleSubmit,
    copyAirdropLink,
    generateMetaContent,
    generateHashtagsContent,
    isSaving
  };
}
