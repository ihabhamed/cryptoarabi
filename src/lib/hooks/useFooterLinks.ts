
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Footer link type
export interface FooterLink {
  id: string;
  title: string;
  url: string;
  category: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Fetch footer links
export const useFooterLinks = () => {
  return useQuery({
    queryKey: ['footer-links'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('footer_links')
        .select('*')
        .order('category')
        .order('sort_order');

      if (error) {
        console.error('Error fetching footer links:', error);
        throw error;
      }

      return data as FooterLink[];
    },
  });
};

// Add footer link
export const useAddFooterLink = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newLink: Omit<FooterLink, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('footer_links')
        .insert(newLink)
        .select()
        .single();

      if (error) {
        console.error('Error adding footer link:', error);
        throw error;
      }

      return data as FooterLink;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['footer-links'] });
      toast({
        title: "تم الإضافة",
        description: "تم إضافة الرابط بنجاح",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: `فشل في إضافة الرابط: ${error.message}`,
      });
    },
  });
};

// Update footer link
export const useUpdateFooterLink = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updatedLink: Partial<FooterLink> & { id: string }) => {
      const { data, error } = await supabase
        .from('footer_links')
        .update(updatedLink)
        .eq('id', updatedLink.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating footer link:', error);
        throw error;
      }

      return data as FooterLink;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['footer-links'] });
      toast({
        title: "تم التحديث",
        description: "تم تحديث الرابط بنجاح",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: `فشل في تحديث الرابط: ${error.message}`,
      });
    },
  });
};

// Delete footer link
export const useDeleteFooterLink = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('footer_links')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting footer link:', error);
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['footer-links'] });
      toast({
        title: "تم الحذف",
        description: "تم حذف الرابط بنجاح",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: `فشل في حذف الرابط: ${error.message}`,
      });
    },
  });
};
