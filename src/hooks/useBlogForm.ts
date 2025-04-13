
import { useEffect } from 'react';
import { useBlogFormState } from './blog/useBlogFormState';
import { useBlogImage } from './blog/useBlogImage';
import { useBlogApi } from './blog/useBlogApi';
import { useBlogSubmit } from './blog/useBlogSubmit';

interface UseBlogFormProps {
  id?: string;
  onSuccess?: () => void;
}

export const useBlogForm = ({ id, onSuccess }: UseBlogFormProps) => {
  const {
    formData,
    setFormData,
    isLoading,
    setIsLoading,
    isEditMode,
    handleChange,
    generateSlug,
    clearFormData
  } = useBlogFormState({ id });

  const {
    uploadingImage,
    selectedImage,
    previewUrl,
    handleImageChange,
    handleRemoveImage,
    uploadBlogImage,
    setInitialImagePreview,
    validateImageUrl
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
        setIsLoading(true);
        const blogData = await fetchBlogPost(id); // Pass id as argument here
        
        if (blogData) {
          console.log("[useBlogForm] Loaded blog data for editing:", blogData);
          console.log(`[useBlogForm] Original image URL from database: "${blogData.image_url || 'NULL'}"`);
          
          setFormData(blogData);
          
          // Set image preview if image_url exists and is valid
          if (blogData.image_url && 
              blogData.image_url !== 'null' && 
              blogData.image_url !== 'undefined' && 
              blogData.image_url.trim() !== '') {
            console.log(`[useBlogForm] Setting initial image preview from blogData: ${blogData.image_url}`);
            setInitialImagePreview(blogData.image_url);
            
            // Validate if the image URL is actually loadable
            validateImageUrl(blogData.image_url).then(isValid => {
              if (!isValid) {
                console.log(`[useBlogForm] WARNING: Image URL validation failed for: ${blogData.image_url}`);
              }
            });
          } else {
            console.log(`[useBlogForm] No valid image URL found in blogData: ${blogData.image_url || 'NULL'}`);
          }
        }
        
        setIsLoading(false);
      }
    };
    
    loadBlogPost();
  }, [id, isEditMode, fetchBlogPost, setFormData, setInitialImagePreview, validateImageUrl, setIsLoading]);

  // Debug image URL state when form data changes
  useEffect(() => {
    console.log(`[useBlogForm] Current form.image_url: "${formData.image_url || 'NULL'}"`);
    console.log(`[useBlogForm] Current previewUrl: "${previewUrl || 'NULL'}"`);
  }, [formData.image_url, previewUrl]);

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
    handleChange,
    handleImageChange,
    handleRemoveImage,
    generateSlug,
    handleSubmit,
    setFormData
  };
};
