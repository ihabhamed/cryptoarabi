import { useState, FormEvent } from 'react';
import { BlogPost } from '@/types/supabase';
import { useBlogApi } from './useBlogApi';
import { useBlogImage } from './useBlogImage';
import { useBlogFormState } from './useBlogFormState';
import { generateMetaTags } from '@/lib/utils/geminiApi';
import { toast } from '@/lib/utils/toast-utils';
import { processImageUrlForStorage, shouldClearImageUrl } from './utils/blogImageUtils';

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
      // Enhanced validation logic to check for empty strings more accurately
      console.log("Validating blog data:", { 
        title: formData.title, 
        titleLength: formData.title?.length, 
        contentLength: formData.content?.length 
      });
      
      // First validate title - special focus since this is causing issues
      if (!formData.title) {
        console.error("[useBlogSubmit] Title is null or undefined");
        toast({
          variant: "destructive",
          title: "بيانات غير مكتملة",
          description: "العنوان مطلوب"
        });
        setIsSaving(false);
        return;
      }
      
      // Then check if title is just whitespace
      if (formData.title.trim() === '') {
        console.error("[useBlogSubmit] Title contains only whitespace");
        toast({
          variant: "destructive",
          title: "بيانات غير مكتملة",
          description: "العنوان مطلوب"
        });
        setIsSaving(false);
        return;
      }
      
      // Now check content
      if (!formData.content || formData.content.trim() === '') {
        toast({
          variant: "destructive",
          title: "بيانات غير مكتملة",
          description: "المحتوى مطلوب"
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
            
            // Also save to sessionStorage for persistence
            sessionStorage.setItem('blogImageUrl', imageUrl);
            sessionStorage.setItem('blogImageIsFile', 'false');
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
          
          // Also save to sessionStorage for persistence
          sessionStorage.setItem('blogImageUrl', previewUrl);
          sessionStorage.setItem('blogImageIsFile', 'false');
        }
      }
      
      // Process the image URL for storage
      finalFormData.image_url = processImageUrlForStorage(finalFormData.image_url);
      
      // CRITICAL: Ensure image_url is properly set or cleared
      // If we're keeping the same or no image, verify it's valid
      if (shouldClearImageUrl(finalFormData.image_url)) {
        console.log("No valid image URL found, setting to null");
        finalFormData.image_url = null;
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
      
      // Explicitly ensure title and content are present
      if (!finalFormData.title || finalFormData.title.trim() === '') {
        console.error("Title is still missing at save time, setting a placeholder");
        finalFormData.title = `Post ${new Date().toISOString()}`;
      }
      
      if (!finalFormData.content || finalFormData.content.trim() === '') {
        console.error("Content is still missing at save time, setting a placeholder");
        finalFormData.content = ' '; // Minimal content
      }
      
      const success = await saveBlogPost(finalFormData);
      
      if (success) {
        // Clear form data and session storage after successful submission
        clearFormData();
        
        // Keep image URL in session storage a little longer to avoid disappearance issues
        setTimeout(() => {
          sessionStorage.removeItem('blogImageUrl');
          sessionStorage.removeItem('blogImageIsFile');
        }, 2000);
        
        // Show success message when saving
        toast({
          title: id ? "تم تحديث المنشور بنجاح" : "تم إضافة المنشور بنجاح",
          description: "سيتم تحديث قائمة المنشورات تلقائياً",
        });
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
