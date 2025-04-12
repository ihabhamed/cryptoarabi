
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/supabase';

export function useBlogPosts() {
  return useQuery({
    queryKey: ['blog_posts'],
    queryFn: async (): Promise<BlogPost[]> => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('publish_date', { ascending: false });
      
      if (error) throw error;
      
      // Ensure we have all required fields for the BlogPost type
      const posts = data?.map(post => ({
        ...post,
        meta_title: post.meta_title || null,
        meta_description: post.meta_description || null,
        hashtags: post.hashtags || null
      })) || [];
      
      return posts;
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
      
      if (data) {
        return {
          ...data,
          meta_title: data.meta_title || null,
          meta_description: data.meta_description || null,
          hashtags: data.hashtags || null
        };
      }
      
      return null;
    },
    enabled: !!slug,
  });
}

export function useRelatedBlogPosts(currentPostId: string | undefined, hashtags: string | undefined) {
  return useQuery({
    queryKey: ['related_blog_posts', currentPostId, hashtags],
    queryFn: async (): Promise<BlogPost[]> => {
      if (!currentPostId || !hashtags) return [];
      
      const hashtagsArray = hashtags.split(',').map(tag => tag.trim());
      
      // Fetch posts that have at least one matching hashtag
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .neq('id', currentPostId)
        .filter('hashtags', 'ilike', `%${hashtagsArray[0]}%`)
        .order('publish_date', { ascending: false })
        .limit(4);
      
      if (error) throw error;
      
      // Ensure we have all required fields for the BlogPost type
      const posts = data?.map(post => ({
        ...post,
        meta_title: post.meta_title || null,
        meta_description: post.meta_description || null,
        hashtags: post.hashtags || null
      })) || [];
      
      return posts;
    },
    enabled: !!currentPostId && !!hashtags,
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string): Promise<string> => {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
    },
  });
}
