
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
 * Note: about_features can be string[] in the application but is stored as a JSON string in the database.
 */
export interface SiteSettings {
  id: string;
  site_name: string;
  hero_title: string;
  hero_subtitle: string;
  cta_primary_text: string;
  cta_secondary_text: string;
  active_users_count: string;
  successful_projects_count: string;
  support_hours: string;
  about_title: string;
  about_content: string;
  about_image_url: string;
  about_features: string[] | string; // Can be array in UI, stored as JSON string in DB
  about_year_founded: string | null;
  about_button_text: string | null;
  about_button_url: string | null;
  footer_description: string;
  privacy_policy: string | null;
  terms_conditions: string | null;
  updated_at: string;
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

      // Process about_features field
      if (data && typeof data.about_features === 'string') {
        try {
          // Parse the JSON string to get the array
          data.about_features = JSON.parse(data.about_features);
        } catch (e) {
          // If parsing fails, set to empty array string
          console.error('Error parsing about_features:', e);
          data.about_features = '[]';
        }
      } else if (data && !data.about_features) {
        // Default to empty array string if not present
        data.about_features = '[]';
      }
      
      return data as SiteSettings;
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
      // Clone the settings to avoid modifying the original object
      const dataToStore = { ...updatedSettings };
      
      // Prepare about_features for storage
      if (dataToStore.about_features !== undefined) {
        // Convert array to JSON string for database storage
        if (Array.isArray(dataToStore.about_features)) {
          dataToStore.about_features = JSON.stringify(dataToStore.about_features);
        }
      }

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

      // Process about_features in the response
      if (data && typeof data.about_features === 'string') {
        try {
          // Parse the JSON string to get the array
          data.about_features = JSON.parse(data.about_features);
        } catch (e) {
          console.error('Error parsing about_features in response:', e);
          // Default to empty array string on parsing error
          data.about_features = '[]';
        }
      } else if (data && !data.about_features) {
        // Default to empty array string if not present
        data.about_features = '[]';
      }

      return data as SiteSettings;
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
