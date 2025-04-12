
import { useEffect } from 'react';
import { useBlogFormState } from './blog/useBlogFormState';
import { useBlogImage } from './blog/useBlogImage';
import { useBlogApi } from './blog/useBlogApi';
import { BlogPost } from '@/types/supabase';

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
    isSaving,
    setIsSaving,
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
    fetchBlogPost,
    saveBlogPost
  } = useBlogApi({ id, onSuccess });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      if (!formData.slug && formData.title) {
        generateSlug();
      }
      
      // Upload image if selected
      let finalFormData: Partial<BlogPost> = { ...formData };
      
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
