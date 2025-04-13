
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from '@/types/supabase';
import { toast } from "@/lib/utils/toast-utils";
import { validateBlogData, createCleanBlogData, generateUniqueSlug } from './utils/blogDataUtils';

/**
 * Hook for blog post save/update operations
 */
export function useBlogSave() {
  /**
   * Saves or updates a blog post
   */
  const saveBlogPost = async (blogData: Partial<BlogPost>, id?: string): Promise<boolean> => {
    try {
      console.log("Saving blog post, original data:", blogData);
      const isEditMode = !!id;
      
      // Enhanced validation with more detailed logging
      console.log("Validating blog data with:", { 
        title: blogData.title, 
        titleLength: blogData.title?.length, 
        contentLength: blogData.content?.length 
      });
      
      // Validate that required fields are present and not empty strings
      if (!validateBlogData(blogData)) {
        toast({
          variant: "destructive",
          title: "بيانات غير مكتملة",
          description: "العنوان والمحتوى مطلوبان",
        });
        return false;
      }
      
      // Ensure we have a valid slug
      if (!blogData.slug || blogData.slug === 'null' || blogData.slug.trim() === '') {
        blogData.slug = generateUniqueSlug(blogData.title);
        console.log("Generated slug for post:", blogData.slug);
      }

      // Create a clean data object with only the fields that exist in the database
      const cleanData = createCleanBlogData(blogData);
      
      // LOG THE FINAL IMAGE URL BEING SAVED FOR DEBUGGING
      console.log(`FINAL IMAGE URL BEING SAVED TO DATABASE: '${cleanData.image_url}'`);
      
      let result;
      
      if (isEditMode && id) {
        // TypeScript requires content to be present, so we need to ensure it's there
        // If content exists in the original data, it will be present in cleanData
        if (!cleanData.content && blogData.content) {
          cleanData.content = blogData.content;
        }
        
        // Ensure content is not an empty string
        if (cleanData.content && cleanData.content.trim() === '') {
          cleanData.content = ' '; // Add a space to prevent empty string issues
        }
        
        result = await supabase
          .from('blog_posts')
          .update(cleanData as { content: string, title: string, [key: string]: any })
          .eq('id', id);
        
        if (result.error) {
          console.error("Supabase update error:", result.error);
          throw result.error;
        }
        
        // Verify the image URL was saved correctly
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
        // For insertion, content is required by the database schema
        if (!cleanData.content && blogData.content) {
          cleanData.content = blogData.content;
        }
        
        // Ensure content is not an empty string
        if (cleanData.content && cleanData.content.trim() === '') {
          cleanData.content = ' '; // Add a space to prevent empty string issues
        }
        
        // Ensure required fields are present for insertion
        if (!cleanData.content || !cleanData.title) {
          console.error("Missing required fields for blog insertion:", cleanData);
          throw new Error("المحتوى والعنوان مطلوبان لإنشاء منشور جديد");
        }
        
        result = await supabase
          .from('blog_posts')
          .insert(cleanData as { content: string, title: string, [key: string]: any });
        
        if (result.error) {
          console.error("Supabase insert error:", result.error);
          throw result.error;
        }
        
        toast({
          title: "تمت الإضافة بنجاح",
          description: "تم إضافة المنشور بنجاح",
        });
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
    saveBlogPost
  };
}
