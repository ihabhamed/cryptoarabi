
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
    setInitialImagePreview
  } = useBlogImage();

  const {
    fetchBlogPost
  } = useBlogApi({ id, onSuccess });

  const {
    isSaving,
    handleSubmit
  } = useBlogSubmit({ id, onSuccess });

  // Load blog post data if in edit mode
  useEffect(() => {
    const loadBlogPost = async () => {
      if (isEditMode && id) {
        setIsLoading(true);
        const blogData = await fetchBlogPost();
        
        if (blogData) {
          setFormData(blogData);
          
          // Set image preview if image_url exists
          if (blogData.image_url) {
            setInitialImagePreview(blogData.image_url);
          }
        }
        
        setIsLoading(false);
      }
    };
    
    loadBlogPost();
  }, [id, isEditMode]);

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
