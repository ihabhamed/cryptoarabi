
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
          publish_date: data.publish_date
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
      
      if (isEditMode && id) {
        // Ensure required fields are present in the update
        const updateData = {
          ...blogData,
          title: blogData.title as string,
          content: blogData.content as string
        };
        
        const { error } = await supabase
          .from('blog_posts')
          .update(updateData)
          .eq('id', id);
        
        if (error) throw error;
        
        toast({
          title: "تم التحديث بنجاح",
          description: "تم تحديث المنشور بنجاح",
        });
      } else {
        // For insertion, explicitly provide required fields
        const newPost = {
          title: blogData.title as string,
          content: blogData.content as string,
          excerpt: blogData.excerpt,
          author: blogData.author,
          category: blogData.category,
          slug: blogData.slug,
          image_url: blogData.image_url,
          publish_date: blogData.publish_date
        };
        
        const { error } = await supabase
          .from('blog_posts')
          .insert(newPost);
        
        if (error) throw error;
        
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
