
import { useEffect, useState } from 'react';
import { useBlogFormState } from './blog/useBlogFormState';
import { useBlogImage } from './blog/useBlogImage';
import { useBlogApi } from './blog/useBlogApi';
import { useBlogSubmit } from './blog/useBlogSubmit';
import { toast } from "@/lib/utils/toast-utils";

interface UseBlogFormProps {
  id?: string;
  onSuccess?: () => void;
}

export const useBlogForm = ({ id, onSuccess }: UseBlogFormProps) => {
  const [formLoaded, setFormLoaded] = useState(false);
  
  const {
    formData,
    setFormData,
    isLoading,
    setIsLoading,
    isEditMode,
    handleChange,
    generateSlug,
    clearFormData,
    saveFormState
  } = useBlogFormState({ id });

  const {
    uploadingImage,
    selectedImage,
    previewUrl,
    handleImageChange,
    handleRemoveImage,
    uploadBlogImage,
    setInitialImagePreview,
    validateImageUrl,
    isValidUrl
  } = useBlogImage();

  const {
    fetchBlogPost,
    inspectImageUrls
  } = useBlogApi({ id, onSuccess });

  const {
    isSaving,
    handleSubmit
  } = useBlogSubmit({ id, onSuccess });

  // Validate image URLs for debugging
  useEffect(() => {
    if (isEditMode && id) {
      // Run a direct inspection of image URLs in the database
      inspectImageUrls();
    }
  }, [isEditMode, id, inspectImageUrls]);

  // Load blog post data if in edit mode
  useEffect(() => {
    const loadBlogPost = async () => {
      if (isEditMode && id) {
        try {
          setIsLoading(true);
          console.log(`[useBlogForm] Loading blog post for editing with ID: ${id}`);
          
          const blogData = await fetchBlogPost(id);
          
          if (blogData) {
            console.log("[useBlogForm] Loaded blog data for editing:", blogData);
            console.log(`[useBlogForm] Original image URL from database: "${blogData.image_url || 'NULL'}"`);
            
            setFormData(blogData);
            
            // Set image preview if image_url exists and is valid
            if (blogData.image_url && isValidUrl(blogData.image_url)) {
              console.log(`[useBlogForm] Setting initial image preview from blogData: ${blogData.image_url}`);
              setInitialImagePreview(blogData.image_url);
              
              // Validate if the image URL is actually loadable
              validateImageUrl(blogData.image_url).then(isValid => {
                if (!isValid) {
                  console.log(`[useBlogForm] WARNING: Image URL validation failed for: ${blogData.image_url}`);
                  toast({
                    variant: "warning",
                    title: "تحذير",
                    description: "تعذر تحميل صورة المنشور. يمكنك اختيار صورة أخرى.",
                  });
                }
              });
            } else {
              console.log(`[useBlogForm] No valid image URL found in blogData: ${blogData.image_url || 'NULL'}`);
            }
            
            setFormLoaded(true);
          } else {
            console.error(`[useBlogForm] Failed to load blog post with ID: ${id}`);
            toast({
              variant: "destructive",
              title: "خطأ في التحميل",
              description: "تعذر تحميل بيانات المنشور. يرجى المحاولة مرة أخرى.",
            });
          }
        } catch (error) {
          console.error('[useBlogForm] Error loading blog post:', error);
          toast({
            variant: "destructive",
            title: "خطأ في التحميل",
            description: "حدث خطأ أثناء تحميل بيانات المنشور.",
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        // New post mode, no data to load
        setFormLoaded(true);
      }
    };
    
    loadBlogPost();
  }, [id, isEditMode, fetchBlogPost, setFormData, setInitialImagePreview, validateImageUrl, setIsLoading, isValidUrl]);

  // Debug image URL state when form data changes
  useEffect(() => {
    console.log(`[useBlogForm] Current form.image_url: "${formData.image_url || 'NULL'}"`);
    console.log(`[useBlogForm] Current previewUrl: "${previewUrl || 'NULL'}"`);
  }, [formData.image_url, previewUrl]);

  // Save form state when tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Save form state when tab is hidden
        saveFormState();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [saveFormState]);

  // Clear blogImageUrl from sessionStorage when component unmounts
  useEffect(() => {
    return () => {
      if (!isEditMode) {
        console.log('[useBlogForm] Cleaning up image data from sessionStorage on unmount');
        sessionStorage.removeItem('blogImageUrl');
        sessionStorage.removeItem('blogImageIsFile');
      }
    };
  }, [isEditMode]);

  return {
    formData,
    isLoading,
    isSaving,
    uploadingImage,
    selectedImage,
    previewUrl,
    isEditMode,
    formLoaded,
    handleChange,
    handleImageChange,
    handleRemoveImage,
    generateSlug,
    handleSubmit,
    setFormData
  };
};
