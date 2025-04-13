
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/supabase';
import { cleanImageUrl } from '@/hooks/blog/utils/blogImageUtils';

/**
 * Processes a blog post to ensure all fields are properly typed and handled
 */
const processBlogPost = (post: any): BlogPost => {
  // Process image URL to ensure it's in the correct format
  let processedImageUrl = null;
  
  if (post.image_url && post.image_url !== 'null' && post.image_url !== 'undefined' && post.image_url.trim() !== '') {
    processedImageUrl = cleanImageUrl(post.image_url);
    console.log(`[useBlogPosts] Processing post: ${post.id}, Image URL: "${post.image_url}" -> "${processedImageUrl}"`);
  } else {
    console.log(`[useBlogPosts] Processing post: ${post.id}, No valid image URL found`);
  }
  
  return {
    ...post,
    meta_title: post.meta_title || null,
    meta_description: post.meta_description || null,
    hashtags: post.hashtags || null,
    image_url: processedImageUrl // Ensure null for empty URLs
  };
};

export function useBlogPosts() {
  return useQuery({
    queryKey: ['blog_posts'],
    queryFn: async (): Promise<BlogPost[]> => {
      console.log('[useBlogPosts] Fetching all blog posts');
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('publish_date', { ascending: false });
      
      if (error) {
        console.error('[useBlogPosts] Error fetching blog posts:', error);
        throw error;
      }
      
      console.log(`[useBlogPosts] Successfully fetched ${data?.length || 0} blog posts`);
      
      // Process posts to ensure consistent typing
      const posts = data?.map(processBlogPost) || [];
      
      return posts;
    },
  });
}

export function useBlogPost(slug: string | undefined) {
  return useQuery({
    queryKey: ['blog_posts', slug],
    queryFn: async (): Promise<BlogPost | null> => {
      if (!slug) return null;
      
      console.log(`[useBlogPost] Fetching blog post with slug: ${slug}`);
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      
      if (error) {
        console.error(`[useBlogPost] Error fetching blog post with slug ${slug}:`, error);
        throw error;
      }
      
      if (data) {
        console.log(`[useBlogPost] Successfully fetched blog post: ${data.id}`);
        console.log(`[useBlogPost] Post image URL: ${data.image_url || 'NULL'}`);
        
        return processBlogPost(data);
      }
      
      console.log(`[useBlogPost] No blog post found with slug: ${slug}`);
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
