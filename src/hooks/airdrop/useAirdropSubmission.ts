
import { useAddAirdrop, useUpdateAirdrop } from "@/lib/hooks";
import { toast } from "@/lib/utils/toast-utils";
import { NewAirdrop } from '@/types/supabase';
import { useAirdropValidation } from './useAirdropValidation';

interface UseAirdropSubmissionProps {
  id?: string;
  onSuccess?: () => void;
  clearAirdropFormData: () => void;
}

/**
 * Hook for handling airdrop form submission
 */
export function useAirdropSubmission({ 
  id, 
  onSuccess, 
  clearAirdropFormData 
}: UseAirdropSubmissionProps) {
  const addAirdrop = useAddAirdrop();
  const updateAirdrop = useUpdateAirdrop();
  const { validateAirdropData } = useAirdropValidation();
  
  const handleSubmit = async (
    e: React.FormEvent, 
    formData: NewAirdrop & { meta_title?: string; meta_description?: string; hashtags?: string; steps?: string }
  ) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      const validationError = validateAirdropData(formData);
      if (validationError) {
        throw new Error(validationError);
      }
      
      const finalFormData = { ...formData };
      
      if (id) {
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
      clearAirdropFormData();
      
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
    handleSubmit,
    isSaving: addAirdrop.isPending || updateAirdrop.isPending
  };
}
