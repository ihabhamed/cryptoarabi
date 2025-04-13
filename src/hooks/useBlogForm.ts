import { useEffect, useState } from 'react';
import { useBlogFormState } from './blog/useBlogFormState';
import { useBlogImage } from './blog/useBlogImage';
import { useBlogApi } from './blog/useBlogApi';
import { useBlogSubmit } from './blog/useBlogSubmit';
import { toast } from "@/lib/utils/toast-utils";
import { recoverImageFromStorage } from './blog/utils/blogImageUtils';

interface UseBlogFormProps {
  id?: string;
  onSuccess?: () => void;
}

export const useBlogForm = ({ id, onSuccess }: UseBlogFormProps) => {
  const [formLoaded, setFormLoaded] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  
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
    if (isEditMode && id && loadAttempts === 0) {
      // Run a direct inspection of image URLs in the database
      inspectImageUrls();
    }
  }, [isEditMode, id, inspectImageUrls, loadAttempts]);

  // Load blog post data if in edit mode
  useEffect(() => {
    const loadBlogPost = async () => {
      if (isEditMode && id && !formLoaded && loadAttempts < 3) {
        try {
          setIsLoading(true);
          console.log(`[useBlogForm] Loading blog post for editing with ID: ${id} (attempt ${loadAttempts + 1})`);
          
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
                  // Try to recover from session storage
                  const recoveredUrl = recoverImageFromStorage();
                  if (recoveredUrl) {
                    console.log(`[useBlogForm] Falling back to recovered URL: ${recoveredUrl}`);
                    setInitialImagePreview(recoveredUrl);
                  } else {
                    toast({
                      variant: "warning",
                      title: "تحذير",
                      description: "تعذر تحميل صورة المنشور. يمكنك اختيار صورة أخرى.",
                    });
                  }
                }
              });
            } else {
              console.log(`[useBlogForm] No valid image URL found in blogData: ${blogData.image_url || 'NULL'}`);
              // Try to recover from session storage
              const recoveredUrl = recoverImageFromStorage();
              if (recoveredUrl) {
                console.log(`[useBlogForm] Using recovered image URL: ${recoveredUrl}`);
                setInitialImagePreview(recoveredUrl);
                // Update form data to match
                setFormData(prev => ({ ...prev, image_url: recoveredUrl }));
              }
            }
            
            setFormLoaded(true);
          } else {
            console.error(`[useBlogForm] Failed to load blog post with ID: ${id}`);
            
            // Only show toast after multiple attempts to reduce UI noise during initial loads
            if (loadAttempts >= 2) {
              toast({
                variant: "destructive",
                title: "خطأ في التحميل",
                description: "تعذر تحميل بيانات المنشور. يرجى المحاولة مرة أخرى.",
              });
            }
            
            setLoadAttempts(prev => prev + 1);
          }
        } catch (error) {
          console.error('[useBlogForm] Error loading blog post:', error);
          
          // Only show toast after multiple attempts
          if (loadAttempts >= 2) {
            toast({
              variant: "destructive",
              title: "خطأ في التحميل",
              description: "حدث خطأ أثناء تحميل بيانات المنشور.",
            });
          }
          
          setLoadAttempts(prev => prev + 1);
        } finally {
          setIsLoading(false);
        }
      } else if (!isEditMode) {
        // New post mode, no data to load
        setFormLoaded(true);
        
        // Check for any previously stored image
        const recoveredUrl = recoverImageFromStorage();
        if (recoveredUrl) {
          console.log(`[useBlogForm] Recovered image URL for new post: ${recoveredUrl}`);
          setInitialImagePreview(recoveredUrl);
          setFormData(prev => ({ ...prev, image_url: recoveredUrl }));
        }
      }
    };
    
    loadBlogPost();
  }, [id, isEditMode, fetchBlogPost, setFormData, setInitialImagePreview, validateImageUrl, setIsLoading, isValidUrl, formLoaded, loadAttempts]);

  // Debug image URL state when form data changes
  useEffect(() => {
    console.log(`[useBlogForm] Current form.image_url: "${formData.image_url || 'NULL'}"`);
    console.log(`[useBlogForm] Current previewUrl: "${previewUrl || 'NULL'}"`);
    
    // Ensure image consistency - if formData.image_url changes but previewUrl doesn't match
    if (formData.image_url && formData.image_url !== previewUrl && isValidUrl(formData.image_url)) {
      console.log(`[useBlogForm] Syncing previewUrl with formData.image_url`);
      setInitialImagePreview(formData.image_url);
    }
  }, [formData.image_url, previewUrl, setInitialImagePreview, isValidUrl]);

  // Additional check when route changes to ensure image persistence
  useEffect(() => {
    const handleRouteChange = () => {
      console.log('[useBlogForm] Route change detected, ensuring image data is preserved');
      // Save form state
      saveFormState();
      
      // If we have an image URL, make sure it's stored
      if (formData.image_url && isValidUrl(formData.image_url)) {
        console.log(`[useBlogForm] Saving image on navigation: ${formData.image_url}`);
        sessionStorage.setItem('blogImageUrl', formData.image_url);
        sessionStorage.setItem('blogImageIsFile', 'false');
      } else if (previewUrl) {
        console.log(`[useBlogForm] Saving preview on navigation: ${previewUrl}`);
        sessionStorage.setItem('blogImageUrl', previewUrl);
        sessionStorage.setItem('blogImageIsFile', 'false');
      }
    };
    
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [formData.image_url, previewUrl, isValidUrl, saveFormState]);

  // Save form state when tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Save form state when tab is hidden
        saveFormState();
      } else {
        // On becoming visible, check if image needs to be recovered
        if (!previewUrl && !formData.image_url) {
          const recoveredUrl = recoverImageFromStorage();
          if (recoveredUrl) {
            console.log(`[useBlogForm] Recovered image on visibility change: ${recoveredUrl}`);
            setInitialImagePreview(recoveredUrl);
            setFormData(prev => ({ ...prev, image_url: recoveredUrl }));
          }
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [saveFormState, previewUrl, formData.image_url, setInitialImagePreview, setFormData]);

  // Only clear blogImageUrl from sessionStorage when component unmounts if it's not an edit mode
  // or after submission, not during normal navigation
  useEffect(() => {
    return () => {
      // Don't clear session storage here - we want to keep the image data
      console.log('[useBlogForm] Component unmounting, keeping image data in sessionStorage for persistence');
    };
  }, []);

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
