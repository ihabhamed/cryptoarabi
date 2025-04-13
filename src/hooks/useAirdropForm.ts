
import { useState, useEffect } from 'react';
import { useAirdrop } from "@/lib/hooks";
import { formatAirdropData } from '@/lib/utils/airdropFormUtils';
import { useAirdropLink } from '@/hooks/useAirdropLink';
import { useAirdropMetaGeneration } from '@/hooks/useAirdropMetaGeneration';
import { useAirdropStorage } from '@/hooks/airdrop/useAirdropStorage';
import { useAirdropFormHandlers } from '@/hooks/airdrop/useAirdropFormHandlers';
import { useAirdropSubmission } from '@/hooks/airdrop/useAirdropSubmission';
import { toast } from '@/lib/utils/toast-utils';

interface UseAirdropFormProps {
  id?: string;
  onSuccess?: () => void;
}

export function useAirdropForm({ id, onSuccess }: UseAirdropFormProps) {
  const isEditMode = !!id;
  const { data: existingAirdrop, isLoading, error: fetchError } = useAirdrop(id);
  const { linkCopied, copyAirdropLink: baseCopyAirdropLink } = useAirdropLink();
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // If there's an error fetching airdrop data, show a toast
  useEffect(() => {
    if (fetchError) {
      console.error("Error fetching airdrop data:", fetchError);
      toast({
        title: "خطأ في التحميل",
        description: "حدث خطأ أثناء تحميل بيانات الإيردروب. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    }
  }, [fetchError]);
  
  // Refresh form when a custom event is dispatched
  useEffect(() => {
    const handleFormRefresh = () => {
      console.log('Force refreshing airdrop form data');
      setForceUpdate(prev => prev + 1);
    };
    
    window.addEventListener('airdrop-form-refresh', handleFormRefresh);
    
    return () => {
      window.removeEventListener('airdrop-form-refresh', handleFormRefresh);
    };
  }, []);
  
  // Create a wrapper function that passes the ID to copyAirdropLink
  const copyAirdropLink = () => {
    try {
      if (id) {
        baseCopyAirdropLink(id);
      } else {
        baseCopyAirdropLink();
      }
    } catch (error) {
      console.error("Error copying link:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء نسخ الرابط",
        variant: "destructive"
      });
    }
  };

  // Get formatted data for storage
  const formattedAirdropData = existingAirdrop ? formatAirdropData(existingAirdrop) : undefined;
  
  useEffect(() => {
    if (formattedAirdropData && Object.keys(formattedAirdropData).length > 0) {
      console.log('Received formatted airdrop data:', formattedAirdropData);
    }
  }, [formattedAirdropData]);
  
  // Use the storage hook
  const {
    formData,
    setFormData,
    clearAirdropFormData
  } = useAirdropStorage({
    id,
    isEditMode,
    initialData: formattedAirdropData,
    forceUpdate // Pass the forceUpdate value to trigger re-renders
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
    e.preventDefault();
    
    // Basic validation
    if (!formData.title) {
      toast({
        title: "حقل مطلوب",
        description: "يرجى إدخال عنوان الإيردروب",
        variant: "destructive"
      });
      return;
    }
    
    submitForm(e, formData);
  };

  // Force re-render when tab becomes active or forceUpdate changes
  useEffect(() => {
    console.log("Force update triggered:", forceUpdate);
    // This empty dependency array with forceUpdate will make sure 
    // the component re-evaluates its state when forceUpdate changes
  }, [forceUpdate]);

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
