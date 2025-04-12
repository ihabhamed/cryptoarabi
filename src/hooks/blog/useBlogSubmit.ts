
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
      let finalFormData: Partial<BlogPost & { meta_title?: string; meta_description?: string }> = { ...formData };
      
      if ((!finalFormData.meta_title || !finalFormData.meta_description) && finalFormData.title && finalFormData.content) {
        try {
          const { metaTitle, metaDescription } = await generateMetaTags(
            finalFormData.title,
            finalFormData.content
          );
          
          if (!finalFormData.meta_title) {
            finalFormData.meta_title = metaTitle;
          }
          
          if (!finalFormData.meta_description) {
            finalFormData.meta_description = metaDescription;
          }
        } catch (error) {
          console.error("Error generating meta tags:", error);
          // Continue with submission even if meta generation fails
        }
      }
      
      // Upload image if selected
      if (selectedImage) {
        const imageUrl = await uploadBlogImage();
        
        if (imageUrl) {
          finalFormData = { 
            ...finalFormData, 
            image_url: imageUrl 
          };
        } else {
          setIsSaving(false);
          return;
        }
      }
      
      const success = await saveBlogPost(finalFormData);
      
      if (success) {
        // Clear form data after successful submission
        clearFormData();
      }
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
