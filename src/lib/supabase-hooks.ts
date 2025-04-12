
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Airdrop, BlogPost, Service } from '@/types/supabase';

// Airdrops
export function useAirdrops() {
  return useQuery({
    queryKey: ['airdrops'],
    queryFn: async (): Promise<Airdrop[]> => {
      const { data, error } = await supabase
        .from('airdrops')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
}

export function useAirdrop(id: string | undefined) {
  return useQuery({
    queryKey: ['airdrops', id],
    queryFn: async (): Promise<Airdrop | null> => {
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
    mutationFn: async (newAirdrop: Partial<Airdrop>): Promise<Airdrop> => {
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
    mutationFn: async ({ id, ...updatedAirdrop }: { id: string } & Partial<Airdrop>): Promise<Airdrop> => {
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
    mutationFn: async (id: string): Promise<string> => {
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
    queryFn: async (): Promise<BlogPost[]> => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('publish_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
}

export function useBlogPost(slug: string | undefined) {
  return useQuery({
    queryKey: ['blog_posts', slug],
    queryFn: async (): Promise<BlogPost | null> => {
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
    queryFn: async (): Promise<Service[]> => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
}
