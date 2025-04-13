
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
          console.log("Loaded blog data for editing:", blogData);
          console.log(`Original image URL from database: ${blogData.image_url}`);
          
          setFormData(blogData);
          
          // Set image preview if image_url exists and is valid
          if (blogData.image_url && 
              blogData.image_url !== 'null' && 
              blogData.image_url !== 'undefined' && 
              blogData.image_url.trim() !== '') {
            console.log(`Setting initial image preview from blogData: ${blogData.image_url}`);
            setInitialImagePreview(blogData.image_url);
          } else {
            console.log(`No valid image URL found in blogData: ${blogData.image_url}`);
          }
        }
        
        setIsLoading(false);
      }
    };
    
    loadBlogPost();
  }, [id, isEditMode]);

  // Add a useEffect to update image URL when form data changes
  useEffect(() => {
    if (formData.image_url && !previewUrl) {
      // Only if image URL is valid and preview is not set yet
      if (formData.image_url !== 'null' && 
          formData.image_url !== 'undefined' && 
          formData.image_url.trim() !== '') {
        console.log(`Setting image preview from form data: ${formData.image_url}`);
        setInitialImagePreview(formData.image_url);
      }
    }
  }, [formData.image_url, previewUrl]);

  // Add a debug useEffect to log any image URL changes
  useEffect(() => {
    if (formData.image_url) {
      console.log(`Form data image URL updated: ${formData.image_url}`);
    }
  }, [formData.image_url]);

  // Clear blogImageUrl from sessionStorage when component unmounts
  useEffect(() => {
    return () => {
      if (!isEditMode) {
        console.log('Cleaning up image data from sessionStorage on unmount');
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
