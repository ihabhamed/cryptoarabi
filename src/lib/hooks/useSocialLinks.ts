
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Social link type
export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

// Fetch social links
export const useSocialLinks = () => {
  return useQuery({
    queryKey: ['social-links'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_links')
        .select('*');

      if (error) {
        console.error('Error fetching social links:', error);
        throw error;
      }

      return data as SocialLink[];
    },
  });
};

// Add social link
export const useAddSocialLink = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newLink: Omit<SocialLink, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('social_links')
        .insert(newLink)
        .select()
        .single();

      if (error) {
        console.error('Error adding social link:', error);
        throw error;
      }

      return data as SocialLink;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-links'] });
      toast({
        title: "تم الإضافة",
        description: "تم إضافة الرابط الاجتماعي بنجاح",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: `فشل في إضافة الرابط الاجتماعي: ${error.message}`,
      });
    },
  });
};

// Update social link
export const useUpdateSocialLink = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updatedLink: Partial<SocialLink> & { id: string }) => {
      const { data, error } = await supabase
        .from('social_links')
        .update(updatedLink)
        .eq('id', updatedLink.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating social link:', error);
        throw error;
      }

      return data as SocialLink;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-links'] });
      toast({
        title: "تم التحديث",
        description: "تم تحديث الرابط الاجتماعي بنجاح",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: `فشل في تحديث الرابط الاجتماعي: ${error.message}`,
      });
    },
  });
};

// Delete social link
export const useDeleteSocialLink = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('social_links')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting social link:', error);
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-links'] });
      toast({
        title: "تم الحذف",
        description: "تم حذف الرابط الاجتماعي بنجاح",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: `فشل في حذف الرابط الاجتماعي: ${error.message}`,
      });
    },
  });
};
