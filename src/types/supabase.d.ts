
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Re-export the interfaces from their respective files
export type { Airdrop, NewAirdrop } from './airdrop';
export type { BlogPost } from './blog';
export type { Service } from './service';
export type { SiteSettings } from './site-settings';

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
          updated_at: string
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
