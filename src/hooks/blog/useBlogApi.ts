
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/utils/toast-utils";
import { BlogPost } from '@/types/supabase';

interface UseBlogApiProps {
  id?: string;
  onSuccess?: () => void;
}

export function useBlogApi({ id, onSuccess }: UseBlogApiProps = {}) {
  const isEditMode = !!id;

  const fetchBlogPost = async (): Promise<Partial<BlogPost> | null> => {
    if (!isEditMode || !id) return null;
    
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
        // Log the image URL specifically for debugging
        console.log(`Fetched blog post image URL: ${data.image_url}`);
        
        return {
          id: data.id,
          title: data.title || '',
          content: data.content || '',
          excerpt: data.excerpt || '',
          author: data.author || '',
          category: data.category || '',
          slug: data.slug || '',
          image_url: data.image_url || '',
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

  const saveBlogPost = async (blogData: Partial<BlogPost>): Promise<boolean> => {
    try {
      console.log("Saving blog post, original data:", blogData);
      
      // Validate that required fields are present
      if (!blogData.title || !blogData.content) {
        console.error("Missing required fields. Title:", blogData.title, "Content length:", blogData.content?.length);
        toast({
          variant: "destructive",
          title: "بيانات غير مكتملة",
          description: "العنوان والمحتوى مطلوبان",
        });
        return false;
      }
      
      // CRITICAL: Always ensure we have a valid slug
      if (!blogData.slug || blogData.slug === 'null' || blogData.slug.trim() === '') {
        // Generate a timestamp-based slug for uniqueness
        const timestamp = new Date().getTime().toString().slice(-8);
        
        // Check if title contains Arabic characters
        if (blogData.title && /[\u0600-\u06FF]/.test(blogData.title)) {
          // For Arabic titles, create a generic slug with timestamp
          blogData.slug = `post-${timestamp}`;
        } else if (blogData.title) {
          // For non-Arabic titles, create a slug from the title
          blogData.slug = blogData.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-')     // Replace spaces with hyphens
            .replace(/-+/g, '-')      // Replace multiple hyphens with a single one
            .replace(/^-+|-+$/g, '')  // Remove hyphens from start and end
            .concat(`-${timestamp}`);  // Add timestamp for uniqueness
        } else {
          // Fallback for no title
          blogData.slug = `post-${timestamp}`;
        }
        
        console.log("Generated slug for post:", blogData.slug);
      }

      // CRITICAL IMAGE URL HANDLING: Log and validate the image URL before saving
      console.log(`Raw image URL before processing: '${blogData.image_url}'`);
      
      // If image_url is an empty string, null, undefined, or "null"/"undefined" strings, 
      // make sure we set it to null in the database
      if (!blogData.image_url || 
          blogData.image_url === 'null' || 
          blogData.image_url === 'undefined' || 
          blogData.image_url.trim() === '') {
        console.log("Setting image_url to null before saving");
        blogData.image_url = null;
      } else {
        // Remove any query parameters from the URL to prevent caching issues
        if (typeof blogData.image_url === 'string' && blogData.image_url.includes('?')) {
          const urlWithoutParams = blogData.image_url.split('?')[0];
          console.log(`Removing query parameters from image URL: ${blogData.image_url} -> ${urlWithoutParams}`);
          blogData.image_url = urlWithoutParams;
        }
        
        console.log(`Validated image URL for saving: '${blogData.image_url}'`);
      }
      
      // Create a clean data object with only the fields that exist in the database
      const cleanData = {
        title: blogData.title,
        content: blogData.content,
        excerpt: blogData.excerpt || null,
        author: blogData.author || null,
        category: blogData.category || null,
        slug: blogData.slug, // Now guaranteed to have a value
        image_url: blogData.image_url, // Now properly handled for null cases
        publish_date: blogData.publish_date || new Date().toISOString(),
        meta_title: blogData.meta_title || null,
        meta_description: blogData.meta_description || null,
        hashtags: blogData.hashtags || null
      };
      
      // LOG THE FINAL IMAGE URL BEING SAVED FOR DEBUGGING
      console.log(`FINAL IMAGE URL BEING SAVED TO DATABASE: '${cleanData.image_url}'`);
      
      let result;
      
      if (isEditMode && id) {
        result = await supabase
          .from('blog_posts')
          .update(cleanData)
          .eq('id', id);
        
        if (result.error) {
          console.error("Supabase update error:", result.error);
          throw result.error;
        }
        
        // After successful update, verify the image URL was saved correctly
        const { data: verifyData, error: verifyError } = await supabase
          .from('blog_posts')
          .select('image_url')
          .eq('id', id)
          .single();
          
        if (!verifyError && verifyData) {
          console.log(`Verified saved image URL in database: '${verifyData.image_url}'`);
        }
        
        toast({
          title: "تم التحديث بنجاح",
          description: "تم تحديث المنشور بنجاح",
        });
      } else {
        result = await supabase
          .from('blog_posts')
          .insert(cleanData);
        
        if (result.error) {
          console.error("Supabase insert error:", result.error);
          throw result.error;
        }
        
        toast({
          title: "تمت الإضافة بنجاح",
          description: "تم إضافة المنشور بنجاح",
        });
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (error: any) {
      console.error("Error in saveBlogPost:", error);
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: error.message || "حدث خطأ أثناء حفظ المنشور",
      });
      return false;
    }
  };

  // Add direct inspection of database image URLs for debugging
  const inspectImageUrls = async (): Promise<void> => {
    if (!isEditMode) return;
    
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
    saveBlogPost,
    inspectImageUrls
  };
}
