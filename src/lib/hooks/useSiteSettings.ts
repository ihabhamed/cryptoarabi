
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
  about_features: string[];
  about_year_founded: string;
  about_button_text: string;
  about_button_url: string;
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

      // Parse string arrays if they exist
      if (data && typeof data.about_features === 'string') {
        try {
          data.about_features = JSON.parse(data.about_features);
        } catch (e) {
          // If parsing fails, set default array
          data.about_features = [
            "فريق من الخبراء المتخصصين في البلوكتشين والعملات المشفرة",
            "أكثر من 5 سنوات من الخبرة في مجال الويب 3.0",
            "استشارات مخصصة لاحتياجات عملك الفريدة",
            "دعم فني على مدار الساعة طوال أيام الأسبوع"
          ];
        }
      } else if (!data.about_features) {
        data.about_features = [
          "فريق من الخبراء المتخصصين في البلوكتشين والعملات المشفرة",
          "أكثر من 5 سنوات من الخبرة في مجال الويب 3.0",
          "استشارات مخصصة لاحتياجات عملك الفريدة",
          "دعم فني على مدار الساعة طوال أيام الأسبوع"
        ];
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
      // Handle arrays that need to be converted to JSON strings for storage
      const processedSettings = { ...updatedSettings };
      
      if (processedSettings.about_features && Array.isArray(processedSettings.about_features)) {
        processedSettings.about_features = JSON.stringify(processedSettings.about_features);
      }
      
      const { data, error } = await supabase
        .from('site_settings')
        .update(processedSettings)
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
