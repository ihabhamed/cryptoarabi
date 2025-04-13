export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author: string | null
          category: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          hashtags: string | null
          id: string
          image_url: string | null
          meta_description: string | null
          meta_title: string | null
          publish_date: string | null
          slug: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          hashtags?: string | null
          id?: string
          image_url?: string | null
          meta_description?: string | null
          meta_title?: string | null
          publish_date?: string | null
          slug?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          hashtags?: string | null
          id?: string
          image_url?: string | null
          meta_description?: string | null
          meta_title?: string | null
          publish_date?: string | null
          slug?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          copyright_text: string | null
          created_at: string
          footer_about_text: string | null
          footer_links_title: string | null
          hero_cta_text: string | null
          hero_description: string | null
          hero_headline: string | null
          hero_video_url: string | null
          id: string
          logo_url: string | null
          site_description: string | null
          site_name: string | null
          show_about_section: boolean
          show_blog_section: boolean
          show_testimonials_section: boolean
          theme_primary_color: string | null
          theme_secondary_color: string | null
          updated_at: string
        }
        Insert: {
          copyright_text?: string | null
          created_at?: string
          footer_about_text?: string | null
          footer_links_title?: string | null
          hero_cta_text?: string | null
          hero_description?: string | null
          hero_headline?: string | null
          hero_video_url?: string | null
          id?: string
          logo_url?: string | null
          site_description?: string | null
          site_name?: string | null
          show_about_section?: boolean
          show_blog_section?: boolean
          show_testimonials_section?: boolean
          theme_primary_color?: string | null
          theme_secondary_color?: string | null
          updated_at?: string
        }
        Update: {
          copyright_text?: string | null
          created_at?: string
          footer_about_text?: string | null
          footer_links_title?: string | null
          hero_cta_text?: string | null
          hero_description?: string | null
          hero_headline?: string | null
          hero_video_url?: string | null
          id?: string
          logo_url?: string | null
          site_description?: string | null
          site_name?: string | null
          show_about_section?: boolean
          show_blog_section?: boolean
          show_testimonials_section?: boolean
          theme_primary_color?: string | null
          theme_secondary_color?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  Public extends boolean = false
> = Public extends true ? Database["public"]["Tables"]
  : Database["public"]["Tables"];

export type Views<
  Public extends boolean = false
> = Public extends true ? Database["public"]["Views"]
  : Database["public"]["Views"];

// MAPPINGS
export interface BlogPost {
  id: string;
  created_at: string;
  updated_at: string;
  title: string | null;
  slug: string | null;
  content: string | null;
  excerpt: string | null;
  author: string | null;
  category: string | null;
  image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  hashtags: string | null;
  publish_date: string | null;
}

// Update SiteSettings to include blog visibility settings
export interface SiteSettings {
  id: string;
  site_name: string;
  site_description: string;
  logo_url: string | null;
  show_about_section: boolean;
  show_testimonials_section: boolean;
  show_blog_section: boolean; // New field for blog visibility
  footer_about_text: string | null;
  footer_links_title: string | null;
  copyright_text: string | null;
  hero_video_url: string | null;
  hero_headline: string | null;
  hero_description: string | null;
  hero_cta_text: string | null;
  theme_primary_color: string | null;
  theme_secondary_color: string | null;
  created_at: string;
  updated_at: string;
}
