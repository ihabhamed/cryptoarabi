
import { NewAirdrop } from '@/types/supabase';

/**
 * Formats airdrop data from API response for form display
 */
export function formatAirdropData(existingAirdrop: any): NewAirdrop {
  return {
    title: existingAirdrop.title,
    description: existingAirdrop.description || '',
    status: existingAirdrop.status,
    twitter_link: existingAirdrop.twitter_link || '',
    youtube_link: existingAirdrop.youtube_link || '',
    claim_url: existingAirdrop.claim_url || '',
    start_date: existingAirdrop.start_date || '',
    end_date: existingAirdrop.end_date || '',
    image_url: existingAirdrop.image_url || '',
    publish_date: existingAirdrop.publish_date
  };
}

/**
 * Creates the sharable airdrop link
 */
export function getAirdropLink(id: string): string {
  return `${window.location.origin}/airdrop/${id}`;
}

/**
 * Validates required airdrop fields
 */
export function validateAirdropData(formData: NewAirdrop): string | null {
  if (!formData.title || !formData.status) {
    return 'العنوان والحالة مطلوبان';
  }
  return null;
}
