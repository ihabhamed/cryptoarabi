
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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

      return data as SiteSettings;
    },
  });
};

// Update site settings
export const useUpdateSiteSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updatedSettings: Partial<SiteSettings>) => {
      const { data, error } = await supabase
        .from('site_settings')
        .update(updatedSettings)
        .eq('id', updatedSettings.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating site settings:', error);
        throw error;
      }

      return data as SiteSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast({
        title: "تم التحديث",
        description: "تم تحديث إعدادات الموقع بنجاح",
        duration: 3000, // Auto-dismiss after 3 seconds
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: `فشل في تحديث إعدادات الموقع: ${error.message}`,
        duration: 5000, // Give more time for error messages
      });
    },
  });
};
