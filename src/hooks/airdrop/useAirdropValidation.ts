
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
    
    // Validate hashtags if present (optional validation)
    if (formData.hashtags) {
      const hashtags = formData.hashtags.split(/[\s,]+/).filter(Boolean);
      
      // Check if any hashtag is too long
      const longHashtag = hashtags.find(tag => tag.length > 30);
      if (longHashtag) {
        return `الهاشتاغ "${longHashtag}" طويل جداً. الحد الأقصى 30 حرف`;
      }
    }
    
    return null;
  };

  return {
    validateAirdropData
  };
}
