
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
      
      // Generate a valid slug if none exists
      if (!blogData.slug) {
        // Generate a timestamp-based slug for uniqueness
        const timestamp = new Date().getTime().toString().slice(-6);
        
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
            .concat(`-${timestamp}`);  // Add timestamp for uniqueness
        } else {
          // Fallback for no title
          blogData.slug = `post-${timestamp}`;
        }
        
        console.log("Generated slug for post:", blogData.slug);
      }
      
      // Create a clean data object with only the fields that exist in the database
      const cleanData = {
        title: blogData.title,
        content: blogData.content,
        excerpt: blogData.excerpt || null,
        author: blogData.author || null,
        category: blogData.category || null,
        slug: blogData.slug || null,
        image_url: blogData.image_url || null,
        publish_date: blogData.publish_date || new Date().toISOString(),
        meta_title: blogData.meta_title || null,
        meta_description: blogData.meta_description || null,
        hashtags: blogData.hashtags || null
      };
      
      console.log("Saving blog post with clean data:", cleanData);
      
      if (isEditMode && id) {
        const { error } = await supabase
          .from('blog_posts')
          .update(cleanData)
          .eq('id', id);
        
        if (error) {
          console.error("Supabase update error:", error);
          throw error;
        }
        
        toast({
          title: "تم التحديث بنجاح",
          description: "تم تحديث المنشور بنجاح",
        });
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert(cleanData);
        
        if (error) {
          console.error("Supabase insert error:", error);
          throw error;
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

  return {
    fetchBlogPost,
    saveBlogPost
  };
}
