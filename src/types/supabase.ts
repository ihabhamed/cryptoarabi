
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

export type Database = {
  public: {
    Tables: {
      airdrops: {
        Row: {
          claim_url: string | null
          created_at: string
          description: string | null
          end_date: string | null
          hashtags: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          publish_date: string
          start_date: string | null
          status: string
          title: string
          twitter_link: string | null
          updated_at: string
          youtube_link: string | null
        }
        Insert: {
          claim_url?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          hashtags?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          publish_date?: string
          start_date?: string | null
          status: string
          title: string
          twitter_link?: string | null
          updated_at?: string
          youtube_link?: string | null
        }
        Update: {
          claim_url?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          hashtags?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          publish_date?: string
          start_date?: string | null
          status?: string
          title?: string
          twitter_link?: string | null
          updated_at?: string
          youtube_link?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string | null
          category: string | null
          content: string
          created_at: string
          excerpt: string | null
          hashtags: string | null
          id: string
          image_url: string | null
          meta_description: string | null
          meta_title: string | null
          publish_date: string
          slug: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          hashtags?: string | null
          id?: string
          image_url?: string | null
          meta_description?: string | null
          meta_title?: string | null
          publish_date?: string
          slug?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          hashtags?: string | null
          id?: string
          image_url?: string | null
          meta_description?: string | null
          meta_title?: string | null
          publish_date?: string
          slug?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      footer_links: {
        Row: {
          category: string
          created_at: string
          id: string
          sort_order: number
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          sort_order?: number
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          sort_order?: number
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          duration: string | null
          id: string
          image_url: string | null
          price: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          image_url?: string | null
          price?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          image_url?: string | null
          price?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          about_button_text: string | null
          about_button_url: string | null
          about_content: string
          about_features: string | null
          about_image_url: string
          about_title: string
          about_year_founded: string | null
          active_users_count: string
          cta_primary_text: string
          cta_secondary_text: string
          footer_description: string
          hero_subtitle: string
          hero_title: string
          id: string
          privacy_policy: string | null
          show_about_section: boolean | null
          show_blog_section: boolean | null
          show_testimonials_section: boolean | null
          site_name: string
          successful_projects_count: string
          support_hours: string
          terms_conditions: string | null
          updated_at: string
        }
        Insert: {
          about_button_text?: string | null
          about_button_url?: string | null
          about_content?: string
          about_features?: string | null
          about_image_url?: string
          about_title?: string
          about_year_founded?: string | null
          active_users_count?: string
          cta_primary_text?: string
          cta_secondary_text?: string
          footer_description?: string
          hero_subtitle?: string
          hero_title?: string
          id?: string
          privacy_policy?: string | null
          show_about_section?: boolean | null
          show_blog_section?: boolean | null
          show_testimonials_section?: boolean | null
          site_name?: string
          successful_projects_count?: string
          support_hours?: string
          terms_conditions?: string | null
          updated_at?: string
        }
        Update: {
          about_button_text?: string | null
          about_button_url?: string | null
          about_content?: string
          about_features?: string | null
          about_image_url?: string
          about_title?: string
          about_year_founded?: string | null
          active_users_count?: string
          cta_primary_text?: string
          cta_secondary_text?: string
          footer_description?: string
          hero_subtitle?: string
          hero_title?: string
          id?: string
          privacy_policy?: string | null
          show_about_section?: boolean | null
          show_blog_section?: boolean | null
          show_testimonials_section?: boolean | null
          site_name?: string
          successful_projects_count?: string
          support_hours?: string
          terms_conditions?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string
          icon: string
          id: string
          platform: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          icon: string
          id?: string
          platform: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          icon?: string
          id?: string
          platform?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_uuid: string }
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
