
import { useImageSelection } from './image/useImageSelection';
import { useImageUpload } from './image/useImageUpload';
import { useImagePersistence } from './image/useImagePersistence';
import { useImageValidation } from './image/useImageValidation';
import { cleanImageUrl, shouldClearImageUrl } from './utils/blogImageUtils';

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
    validateImageUrl,
    isValidUrl,
    isEmptyOrInvalidUrlString
  } = useImageValidation();

  // Wrapper for uploadBlogImage that works with the selected image
  const uploadImage = async (): Promise<string | null> => {
    const imageUrl = await uploadBlogImage(selectedImage);
    if (imageUrl) {
      console.log(`[useBlogImage] Image uploaded successfully: ${imageUrl}`);
      // Immediately update the preview with the new image
      setPreviewUrl(imageUrl);
    }
    return imageUrl;
  };

  // Improved function to set initial image preview with better validation
  const setImagePreview = (url: string | null) => {
    if (!isEmptyOrInvalidUrlString(url)) {
      const cleanedUrl = cleanImageUrl(url as string);
      console.log(`[useBlogImage] Setting image preview with cleaned URL: ${cleanedUrl}`);
      setInitialImagePreview(cleanedUrl);
      
      // Validate if the image can be loaded
      validateImageUrl(cleanedUrl).then(isValid => {
        if (!isValid) {
          console.warn(`[useBlogImage] Warning: Image URL validation failed for: ${cleanedUrl}`);
        }
      });
    } else {
      console.log(`[useBlogImage] Not setting image preview - invalid URL: ${url || 'NULL'}`);
    }
  };

  // Clear image URL if it's null/undefined/empty
  const clearImageIfInvalid = (url: string | null): string | null => {
    return shouldClearImageUrl(url) ? null : url;
  };

  return {
    uploadingImage,
    selectedImage, 
    previewUrl,
    handleImageChange,
    handleRemoveImage,
    uploadBlogImage: uploadImage,
    setInitialImagePreview: setImagePreview,
    validateImageUrl,
    isValidUrl,
    clearImageIfInvalid
  };
}
