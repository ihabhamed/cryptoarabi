
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
      // Validate required fields before proceeding
      if (!formData.title || !formData.content) {
        toast({
          variant: "destructive",
          title: "بيانات غير مكتملة",
          description: "العنوان والمحتوى مطلوبان"
        });
        setIsSaving(false);
        return;
      }
      
      console.log("Form data before submission:", formData);
      
      // Create a working copy of the form data
      let finalFormData: Partial<BlogPost> = { ...formData };
      
      // CRITICAL: Always ensure we have a valid slug before saving
      if (!finalFormData.slug || finalFormData.slug === 'null' || finalFormData.slug.trim() === '') {
        // Generate a timestamp-based slug for uniqueness
        const timestamp = new Date().getTime().toString().slice(-6);
        
        // Check if title contains Arabic characters
        if (finalFormData.title && /[\u0600-\u06FF]/.test(finalFormData.title)) {
          // For Arabic titles, create a generic slug with timestamp
          finalFormData.slug = `post-${timestamp}`;
        } else if (finalFormData.title) {
          // For non-Arabic titles, create a slug from the title
          finalFormData.slug = finalFormData.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-')     // Replace spaces with hyphens
            .replace(/-+/g, '-')      // Replace multiple hyphens with a single one
            .replace(/^-+|-+$/g, '')  // Remove hyphens from start and end
            .concat(`-${timestamp}`);  // Add timestamp for uniqueness
        } else {
          // Fallback for no title
          finalFormData.slug = `post-${timestamp}`;
        }
        
        console.log("Generated slug for submission:", finalFormData.slug);
        
        // Update the form data with the new slug
        setFormData(prev => ({ ...prev, slug: finalFormData.slug }));
      }
      
      // Generate meta title and description if not provided
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
            console.log("Successfully uploaded image, setting image_url to:", imageUrl);
            finalFormData = { 
              ...finalFormData, 
              image_url: imageUrl 
            };
            
            // Update the form data with the new image URL
            setFormData(prev => ({ ...prev, image_url: imageUrl }));
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
      
      // Process hashtags - ensure it's a properly formatted string
      if (finalFormData.hashtags) {
        // If hashtags is an array, join it into a comma-separated string
        if (Array.isArray(finalFormData.hashtags)) {
          finalFormData.hashtags = finalFormData.hashtags.join(', ');
        } 
        // Ensure hashtags is a trimmed string with no empty elements
        else if (typeof finalFormData.hashtags === 'string') {
          // Clean up hashtags - split by comma, trim each tag, filter out empty ones, join back
          const cleanedTags = finalFormData.hashtags
            .split(',')
            .map(tag => tag.trim())
            .filter(Boolean)
            .join(', ');
          
          finalFormData.hashtags = cleanedTags || null;
        } 
        // If it's neither a string nor array, set to null
        else {
          finalFormData.hashtags = null;
        }
      }
      
      console.log("Final form data before save:", finalFormData);
      
      // Double verify that we have a slug before saving
      if (!finalFormData.slug || finalFormData.slug === 'null' || finalFormData.slug === '') {
        finalFormData.slug = `post-${new Date().getTime().toString().slice(-8)}`;
        console.log("Final fallback slug generated:", finalFormData.slug);
      }
      
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
