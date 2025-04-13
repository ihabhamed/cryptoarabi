
import { Database } from './supabase';

export interface Airdrop {
  id: string;
  title: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  publish_date: string;
  status: string;
  twitter_link: string | null;
  youtube_link: string | null;
  claim_url: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  meta_title?: string | null;
  meta_description?: string | null;
  hashtags?: string | null;
  steps?: string | null;
}

// Define a type specifically for inserting new airdrops
export interface NewAirdrop {
  title: string;
  description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  publish_date?: string;
  status: string;
  twitter_link?: string | null;
  youtube_link?: string | null;
  claim_url?: string | null;
  image_url?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  hashtags?: string | null;
  steps?: string | null;
}
