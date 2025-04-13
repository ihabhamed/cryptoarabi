
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
