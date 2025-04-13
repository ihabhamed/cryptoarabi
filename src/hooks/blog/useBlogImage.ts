
import { useImageSelection } from './image/useImageSelection';
import { useImageUpload } from './image/useImageUpload';
import { useImagePersistence } from './image/useImagePersistence';
import { useImageValidation } from './image/useImageValidation';

/**
 * Main hook that combines all image-related functionality for blog posts
 */
export function useBlogImage() {
  const {
    selectedImage,
    previewUrl,
    handleImageChange,
    handleRemoveImage,
    setPreviewUrl
  } = useImageSelection();

  const {
    uploadingImage,
    uploadBlogImage
  } = useImageUpload();

  const {
    persistImageData,
    setInitialImagePreview
  } = useImagePersistence(previewUrl, setPreviewUrl);

  const {
    validateImageUrl
  } = useImageValidation();

  // Wrapper for uploadBlogImage that works with the selected image
  const uploadImage = async (): Promise<string | null> => {
    return await uploadBlogImage(selectedImage);
  };

  return {
    uploadingImage,
    selectedImage, 
    previewUrl,
    handleImageChange,
    handleRemoveImage,
    uploadBlogImage: uploadImage,
    setInitialImagePreview,
    validateImageUrl
  };
}
