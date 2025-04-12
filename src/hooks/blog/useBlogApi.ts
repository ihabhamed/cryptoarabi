
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
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        return {
          title: data.title,
          content: data.content,
          excerpt: data.excerpt || '',
          author: data.author || '',
          category: data.category || '',
          slug: data.slug || '',
          image_url: data.image_url || '',
          publish_date: data.publish_date,
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || '',
          hashtags: data.hashtags || ''
        };
      }
      
      return null;
    } catch (error: any) {
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
      // Validate that required fields are present
      if (!blogData.title || !blogData.content) {
        toast({
          variant: "destructive",
          title: "بيانات غير مكتملة",
          description: "العنوان والمحتوى مطلوبان",
        });
        return false;
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
      
      console.log("Saving blog post with data:", cleanData);
      
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
