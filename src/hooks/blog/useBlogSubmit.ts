
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
  const { uploadingImage, selectedImage, uploadBlogImage, previewUrl } = useBlogImage();
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
        const timestamp = new Date().getTime().toString().slice(-6);
        
        if (finalFormData.title && /[\u0600-\u06FF]/.test(finalFormData.title)) {
          finalFormData.slug = `post-${timestamp}`;
        } else if (finalFormData.title) {
          finalFormData.slug = finalFormData.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '')
            .concat(`-${timestamp}`);
        } else {
          finalFormData.slug = `post-${timestamp}`;
        }
        
        console.log("Generated slug for submission:", finalFormData.slug);
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
        }
      }
      
      // Upload image if selected
      if (selectedImage) {
        try {
          console.log("Uploading selected image...");
          const imageUrl = await uploadBlogImage();
          
          if (imageUrl) {
            console.log("Successfully uploaded image, setting image_url to:", imageUrl);
            finalFormData.image_url = imageUrl;
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
      } else if (previewUrl && !selectedImage) {
        // If we have a preview URL but no selected image, it means we're using an existing or external URL
        console.log("Using existing preview URL as image:", previewUrl);
        
        // Make sure the image_url is set to the previewUrl if it's a valid URL
        if (previewUrl && 
            previewUrl !== 'null' && 
            previewUrl !== 'undefined' && 
            previewUrl.trim() !== '') {
          finalFormData.image_url = previewUrl;
          console.log("Setting final image_url from previewUrl:", previewUrl);
        }
      }
      
      // CRITICAL: Ensure image_url is properly set or cleared
      // If we still have no image URL but form data has one, preserve it
      if (!finalFormData.image_url && formData.image_url) {
        if (formData.image_url !== 'null' && 
            formData.image_url !== 'undefined' && 
            formData.image_url.trim() !== '') {
          console.log("Using existing form data image URL:", formData.image_url);
          finalFormData.image_url = formData.image_url;
        } else {
          console.log("No valid image URL found, setting to null");
          finalFormData.image_url = null;
        }
      }
      
      // Process hashtags
      if (finalFormData.hashtags) {
        if (Array.isArray(finalFormData.hashtags)) {
          finalFormData.hashtags = finalFormData.hashtags.join(', ');
        } else if (typeof finalFormData.hashtags === 'string') {
          const cleanedTags = finalFormData.hashtags
            .split(',')
            .map(tag => tag.trim())
            .filter(Boolean)
            .join(', ');
          
          finalFormData.hashtags = cleanedTags || null;
        } else {
          finalFormData.hashtags = null;
        }
      }
      
      console.log("Final form data before save:", finalFormData);
      console.log("Final image URL being saved:", finalFormData.image_url);
      
      // Double verify that we have a slug before saving
      if (!finalFormData.slug || finalFormData.slug === 'null' || finalFormData.slug === '') {
        finalFormData.slug = `post-${new Date().getTime().toString().slice(-8)}`;
        console.log("Final fallback slug generated:", finalFormData.slug);
      }
      
      const success = await saveBlogPost(finalFormData);
      
      if (success) {
        // Clear form data and session storage after successful submission
        clearFormData();
        sessionStorage.removeItem('blogImageUrl');
        sessionStorage.removeItem('blogImageIsFile');
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
