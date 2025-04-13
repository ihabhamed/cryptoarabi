
export interface SiteSettings {
  id: string;
  site_name: string;
  site_description: string | null;
  logo_url: string | null;
  show_about_section: boolean;
  show_testimonials_section: boolean;
  show_blog_section: boolean; 
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
