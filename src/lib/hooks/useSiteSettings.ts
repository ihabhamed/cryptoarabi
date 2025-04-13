
/**
 * Site Settings Hook Module
 * 
 * This module provides React Query hooks for fetching and updating site settings.
 * It handles data transformation between frontend (where about_features is an array)
 * and the database (where about_features is stored as a JSON string).
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/utils/toast-utils";

/**
 * SiteSettings interface
 * Represents the site settings data structure used throughout the application.
 * Note: about_features is string[] in the application but is stored as a JSON string in the database.
 */
export interface SiteSettings {
  id: string;
  site_name: string;
  hero_title: string;
  hero_subtitle: string;
  hero_headline: string | null;
  hero_description: string | null;
  hero_cta_text: string | null;
  hero_video_url: string | null;
  cta_primary_text: string;
  cta_secondary_text: string;
  active_users_count: string;
  successful_projects_count: string;
  support_hours: string;
  about_title: string;
  about_content: string;
  about_image_url: string;
  about_features: string[]; // In the application, it's always a string array
  about_year_founded: string | null;
  about_button_text: string | null;
  about_button_url: string | null;
  footer_description: string;
  privacy_policy: string | null;
  terms_conditions: string | null;
  updated_at: string;
  show_about_section: boolean;
  show_testimonials_section: boolean;
  show_blog_section: boolean;
}

/**
 * SiteSettingsDB interface
 * Represents the site settings data structure in the database.
 * The about_features field is stored as a JSON string in the database.
 */
export interface SiteSettingsDB extends Omit<SiteSettings, 'about_features'> {
  about_features: string; // In the database, it's stored as a JSON string
}

/**
 * Hook to fetch site settings
 * 
 * @returns React Query result with site settings data
 */
export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      // Fetch site settings from Supabase
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching site settings:', error);
        throw error;
      }

      // Create a new object with the processed data
      const processedData: SiteSettings = {
        ...data as SiteSettingsDB,
        // Process about_features field (convert from string to array)
        about_features: []
      };

      // Process about_features field
      if (data && typeof data.about_features === 'string') {
        try {
          // Parse the JSON string to get the array
          processedData.about_features = JSON.parse(data.about_features);
        } catch (e) {
          // If parsing fails, set to empty array
          console.error('Error parsing about_features:', e);
          processedData.about_features = [];
        }
      }
      
      console.log('Processed site settings:', processedData);
      return processedData;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2, // Retry failed requests twice
  });
};

/**
 * Hook to update site settings
 * 
 * @returns React Query mutation for updating site settings
 */
export const useUpdateSiteSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updatedSettings: Partial<SiteSettings>) => {
      console.log('Updating site settings with:', updatedSettings);
      
      // Create a new object of type Partial<SiteSettingsDB>
      // Need to be explicit about the type and handle about_features conversion
      const dataToStore: Partial<SiteSettingsDB> = { 
        ...Object.keys(updatedSettings).reduce((acc, key) => {
          if (key !== 'about_features') {
            // @ts-ignore - We know these properties exist
            acc[key] = updatedSettings[key];
          }
          return acc;
        }, {} as Partial<SiteSettingsDB>)
      };
      
      // Handle about_features separately to ensure proper type conversion
      if (updatedSettings.about_features !== undefined) {
        dataToStore.about_features = JSON.stringify(updatedSettings.about_features);
      }

      console.log('Data being stored in database:', dataToStore);

      // Update site settings in Supabase
      const { data, error } = await supabase
        .from('site_settings')
        .update(dataToStore)
        .eq('id', updatedSettings.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating site settings:', error);
        throw error;
      }

      // Create a new object with the processed data
      const processedResponse: SiteSettings = {
        ...data as SiteSettingsDB,
        // Default to empty array for about_features
        about_features: []
      };

      // Process about_features in the response
      if (data && typeof data.about_features === 'string') {
        try {
          // Parse the JSON string to get the array
          processedResponse.about_features = JSON.parse(data.about_features);
        } catch (e) {
          console.error('Error parsing about_features in response:', e);
          // Default to empty array on parsing error
          processedResponse.about_features = [];
        }
      }

      console.log('Updated site settings response:', processedResponse);
      return processedResponse;
    },
    onSuccess: () => {
      // Invalidate cached data to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      
      // Show success toast notification
      toast({
        title: "تم التحديث",
        description: "تم تحديث إعدادات الموقع بنجاح"
      });
    },
    onError: (error) => {
      // Show error toast notification
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: `فشل في تحديث إعدادات الموقع: ${error.message}`
      });
    },
  });
};
