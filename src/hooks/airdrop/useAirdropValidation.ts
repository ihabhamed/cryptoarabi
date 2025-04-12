
import { NewAirdrop } from '@/types/supabase';

/**
 * Hook for validating airdrop form data
 */
export function useAirdropValidation() {
  /**
   * Validates required airdrop fields
   */
  const validateAirdropData = (formData: NewAirdrop): string | null => {
    if (!formData.title || !formData.status) {
      return 'العنوان والحالة مطلوبان';
    }
    return null;
  };

  return {
    validateAirdropData
  };
}
