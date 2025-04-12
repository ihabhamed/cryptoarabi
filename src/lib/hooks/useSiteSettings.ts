
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/utils/toast-utils";

// Site settings type
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
  about_features: string[] | string; // Can be stored as a JSON string in the database
  about_year_founded: string | null;
  about_button_text: string | null;
  about_button_url: string | null;
  footer_description: string;
  privacy_policy: string | null;
  terms_conditions: string | null;
  updated_at: string;
}

// Fetch site settings
export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching site settings:', error);
        throw error;
      }

      // Parse about_features if it exists and is a string
      if (data && typeof data.about_features === 'string') {
        try {
          data.about_features = JSON.parse(data.about_features);
        } catch (e) {
          // If parsing fails, keep it as a string or set as empty array
          console.error('Error parsing about_features:', e);
          data.about_features = [] as string[]; // Type assertion to string[]
        }
      } else if (data && !data.about_features) {
        // Ensure about_features is at least an empty array if not present
        data.about_features = [] as string[]; // Type assertion to string[]
      }
      
      return data as SiteSettings;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};

// Update site settings
export const useUpdateSiteSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updatedSettings: Partial<SiteSettings>) => {
      // Prepare data for storage - stringify about_features if it's an array
      const dataToStore: any = { ...updatedSettings };
      
      if (dataToStore.about_features !== undefined) {
        // Ensure about_features is stored as a JSON string in the database
        if (Array.isArray(dataToStore.about_features)) {
          dataToStore.about_features = JSON.stringify(dataToStore.about_features);
        }
      }

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

      // Parse about_features in the returned data
      if (data && typeof data.about_features === 'string') {
        try {
          data.about_features = JSON.parse(data.about_features);
        } catch (e) {
          console.error('Error parsing about_features in response:', e);
          data.about_features = [] as string[]; // Type assertion to string[]
        }
      } else if (data && !data.about_features) {
        data.about_features = [] as string[]; // Type assertion to string[]
      }

      return data as SiteSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast({
        title: "تم التحديث",
        description: "تم تحديث إعدادات الموقع بنجاح"
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: `فشل في تحديث إعدادات الموقع: ${error.message}`
      });
    },
  });
};
