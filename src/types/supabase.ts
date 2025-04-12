
export interface Airdrop {
  id: string;
  title: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  publish_date: string;
  status: string; // Changed from 'active' | 'expired' to string to match what Supabase returns
  twitter_link: string | null;
  youtube_link: string | null;
  claim_url: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  meta_title?: string | null;
  meta_description?: string | null;
  hashtags?: string | null;
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
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string | null;
  publish_date: string;
  image_url: string | null;
  slug: string | null;
  excerpt: string | null;
  category: string | null;
  created_at: string;
  updated_at: string;
  meta_title: string | null;
  meta_description: string | null;
  hashtags: string | null;
}

export interface Service {
  id: string;
  title: string;
  description: string | null;
  price: string | null;
  duration: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}
