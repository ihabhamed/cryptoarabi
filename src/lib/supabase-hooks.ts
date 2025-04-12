
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Airdrops
export function useAirdrops() {
  return useQuery({
    queryKey: ['airdrops'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('airdrops')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}

export function useAirdrop(id: string | undefined) {
  return useQuery({
    queryKey: ['airdrops', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('airdrops')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useAddAirdrop() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newAirdrop: any) => {
      const { data, error } = await supabase
        .from('airdrops')
        .insert([newAirdrop])
        .select()
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['airdrops'] });
    },
  });
}

export function useUpdateAirdrop() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updatedAirdrop }: { id: string, [key: string]: any }) => {
      const { data, error } = await supabase
        .from('airdrops')
        .update(updatedAirdrop)
        .eq('id', id)
        .select()
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['airdrops'] });
      queryClient.invalidateQueries({ queryKey: ['airdrops', variables.id] });
    },
  });
}

export function useDeleteAirdrop() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('airdrops')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['airdrops'] });
    },
  });
}

// Blog Posts
export function useBlogPosts() {
  return useQuery({
    queryKey: ['blog_posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('publish_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}

export function useBlogPost(slug: string | undefined) {
  return useQuery({
    queryKey: ['blog_posts', slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}

// Services
export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}
