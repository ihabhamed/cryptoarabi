
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Airdrop, NewAirdrop } from '@/types/supabase';

export function useAirdrops() {
  return useQuery({
    queryKey: ['airdrops'],
    queryFn: async (): Promise<Airdrop[]> => {
      const { data, error } = await supabase
        .from('airdrops')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Make sure we cast the data to match our Airdrop interface
      // This ensures image_url is included even if null
      const typedData: Airdrop[] = data?.map(item => ({
        ...item,
        // Add image_url if it doesn't exist in the returned data
        image_url: item.image_url ?? null
      })) || [];
      
      return typedData;
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
      
      // Ensure the returned data conforms to our Airdrop interface
      if (data) {
        const typedData: Airdrop = {
          ...data,
          // Add image_url if it doesn't exist in the returned data
          image_url: data.image_url ?? null
        };
        return typedData;
      }
      
      return null;
    },
    enabled: !!id,
  });
}

export function useAddAirdrop() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newAirdrop: NewAirdrop): Promise<Airdrop> => {
      // Ensure required fields are present
      if (!newAirdrop.title || !newAirdrop.status) {
        throw new Error('Title and status are required');
      }
      
      const { data, error } = await supabase
        .from('airdrops')
        .insert(newAirdrop)
        .select()
        .maybeSingle();
      
      if (error) throw error;
      
      // Ensure the returned data conforms to our Airdrop interface
      const typedData: Airdrop = {
        ...data,
        // Add image_url if it doesn't exist in the returned data
        image_url: data.image_url ?? null
      };
      
      return typedData;
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
      
      // Ensure the returned data conforms to our Airdrop interface
      const typedData: Airdrop = {
        ...data,
        // Add image_url if it doesn't exist in the returned data
        image_url: data.image_url ?? null
      };
      
      return typedData;
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
