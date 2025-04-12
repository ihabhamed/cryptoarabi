import { useState, FormEvent } from 'react';
import { BlogPost } from '@/types/supabase';
import { useBlogApi } from './useBlogApi';
import { useBlogImage } from './useBlogImage';
import { useBlogFormState } from './useBlogFormState';
import { generateMetaTags } from '@/lib/utils/geminiApi';
import { toast } from '@/lib/utils/toast-utils';

interface UseBlogSubmitProps {
  id?: string;
  onSuccess?: () => void;
}

export function useBlogSubmit({ id, onSuccess }: UseBlogSubmitProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { formData, setFormData, generateSlug, clearFormData } = useBlogFormState({ id });
  const { uploadingImage, selectedImage, uploadBlogImage } = useBlogImage();
  const { saveBlogPost } = useBlogApi({ id, onSuccess });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      if (!formData.slug && formData.title) {
        generateSlug();
      }
      
      // Generate meta title and description if not provided
      let finalFormData: Partial<BlogPost> = { ...formData };
      
      if ((!finalFormData.meta_title || !finalFormData.meta_description) && finalFormData.title && finalFormData.content) {
        try {
          const { metaTitle, metaDescription } = await generateMetaTags(
            finalFormData.title,
            finalFormData.content
          );
          
          if (!finalFormData.meta_title && metaTitle) {
            finalFormData.meta_title = metaTitle;
          }
          
          if (!finalFormData.meta_description && metaDescription) {
            finalFormData.meta_description = metaDescription;
          }
        } catch (error) {
          console.error("Error generating meta tags:", error);
          // Continue with submission even if meta generation fails
        }
      }
      
      // Upload image if selected
      if (selectedImage) {
        try {
          const imageUrl = await uploadBlogImage();
          
          if (imageUrl) {
            finalFormData = { 
              ...finalFormData, 
              image_url: imageUrl 
            };
          } else {
            toast({
              variant: "destructive",
              title: "خطأ في رفع الصورة",
              description: "لم نتمكن من رفع الصورة. يرجى المحاولة مرة أخرى."
            });
            setIsSaving(false);
            return;
          }
        } catch (imageError) {
          console.error("Error uploading image:", imageError);
          toast({
            variant: "destructive",
            title: "خطأ في رفع الصورة",
            description: "حدث خطأ أثناء رفع الصورة. يرجى المحاولة مرة أخرى."
          });
          setIsSaving(false);
          return;
        }
      }
      
      // Ensure hashtags is a string or null, not an array
      if (finalFormData.hashtags && typeof finalFormData.hashtags !== 'string') {
        // If it's already an array, join it
        if (Array.isArray(finalFormData.hashtags)) {
          finalFormData.hashtags = finalFormData.hashtags.join(', ');
        } else {
          // Otherwise convert to string or null
          finalFormData.hashtags = String(finalFormData.hashtags) || null;
        }
      }
      
      console.log("Final form data before save:", finalFormData);
      
      const success = await saveBlogPost(finalFormData);
      
      if (success) {
        // Clear form data after successful submission
        clearFormData();
      }
    } catch (error) {
      console.error("Error in blog submission:", error);
      toast({
        variant: "destructive",
        title: "خطأ في حفظ المنشور",
        description: "حدث خطأ غير متوقع أثناء حفظ المنشور. يرجى المحاولة مرة أخرى."
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    uploadingImage,
    handleSubmit,
    setIsSaving
  };
}
