
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
        contentLength: blogData.content?.length,
        imageUrl: blogData.image_url || 'NULL'
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
        // Make sure content is not empty (required by DB schema)
        if (!cleanData.content && blogData.content) {
          cleanData.content = blogData.content;
        }
        
        // Ensure content is not an empty string
        if (cleanData.content && cleanData.content.trim() === '') {
          cleanData.content = ' '; // Add a space to prevent empty string issues
        }
        
        // Make a full explicit type for the update
        const updateData: Record<string, any> = {
          ...cleanData,
          updated_at: new Date().toISOString()
        };
        
        // Ensure image_url is explicitly set (even if null)
        if (!('image_url' in updateData)) {
          updateData.image_url = null;
        }
        
        console.log("Updating blog post with data:", updateData);
        
        result = await supabase
          .from('blog_posts')
          .update(updateData)
          .eq('id', id);
        
        if (result.error) {
          console.error("Supabase update error:", result.error);
          throw result.error;
        }
        
        // Verify the image URL was saved correctly
        const { data: verifyData, error: verifyError } = await supabase
          .from('blog_posts')
          .select('image_url, title')
          .eq('id', id)
          .single();
          
        if (!verifyError && verifyData) {
          console.log(`Verified saved image URL in database for "${verifyData.title}": '${verifyData.image_url || 'NULL'}'`);
        } else {
          console.error("Failed to verify saved data:", verifyError);
        }
        
        toast({
          title: "تم التحديث بنجاح",
          description: "تم تحديث المنشور بنجاح",
        });
      } else {
        // For insertion, content is required by the database schema
        if (!cleanData.content) {
          if (blogData.content) {
            cleanData.content = blogData.content;
          } else {
            cleanData.content = ' '; // Add a fallback default value
          }
        }
        
        // Ensure content is not an empty string
        if (cleanData.content.trim() === '') {
          cleanData.content = ' '; // Add a space to prevent empty string issues
        }
        
        // Ensure required fields are present for insertion
        if (!cleanData.title) {
          console.error("Missing required field 'title' for blog insertion");
          throw new Error("العنوان مطلوب لإنشاء منشور جديد");
        }
        
        // Create properly typed insert data object with explicitly typed content field
        const insertData = {
          ...cleanData,
          content: cleanData.content, // Explicitly include content to satisfy TypeScript
          title: cleanData.title, // Explicitly include title to satisfy TypeScript
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        console.log("Inserting new blog post with data:", insertData);
        
        result = await supabase
          .from('blog_posts')
          .insert(insertData);
        
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
