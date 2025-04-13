
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from '@/types/supabase';
import { toast } from "@/lib/utils/toast-utils";
import { cleanImageUrl, shouldClearImageUrl } from './utils/blogImageUtils';

/**
 * Hook to fetch blog post data by ID
 */
export function useBlogFetch() {
  /**
   * Fetches a blog post by ID
   */
  const fetchBlogPost = async (id: string): Promise<Partial<BlogPost> | null> => {
    if (!id) return null;
    
    try {
      console.log("Fetching blog post with ID:", id);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching blog post:", error);
        throw error;
      }
      
      console.log("Fetched blog post data:", data);
      
      if (data) {
        // Process the image URL to ensure it's valid
        let processedImageUrl = data.image_url;
        
        // Check if the image_url is valid (not null, not 'null' string, etc.)
        if (!shouldClearImageUrl(processedImageUrl)) {
          // Clean valid URL (remove query parameters)
          processedImageUrl = cleanImageUrl(processedImageUrl);
          console.log(`Processed image URL: ${processedImageUrl}`);
        } else {
          processedImageUrl = null;
          console.log('Image URL is null or invalid, setting to null');
        }
        
        return {
          id: data.id,
          title: data.title || '',
          content: data.content || '',
          excerpt: data.excerpt || '',
          author: data.author || '',
          category: data.category || '',
          slug: data.slug || '',
          image_url: processedImageUrl,
          publish_date: data.publish_date || new Date().toISOString(),
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || '',
          hashtags: data.hashtags || ''
        };
      }
      
      return null;
    } catch (error: any) {
      console.error("Error in fetchBlogPost:", error);
      toast({
        variant: "destructive",
        title: "خطأ في جلب البيانات",
        description: error.message || "حدث خطأ أثناء محاولة جلب بيانات المنشور",
      });
      return null;
    }
  };

  /**
   * Utility to inspect image URLs in the database for debugging
   */
  const inspectImageUrls = async (): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, image_url')
        .limit(10);
        
      if (error) throw error;
      
      console.log("IMAGE URL INSPECTION RESULTS:");
      data.forEach(post => {
        console.log(`ID: ${post.id}, Title: ${post.title}, Image URL: ${post.image_url || 'NULL'}`);
      });
    } catch (err) {
      console.error("Error inspecting image URLs:", err);
    }
  };

  return {
    fetchBlogPost,
    inspectImageUrls
  };
}
