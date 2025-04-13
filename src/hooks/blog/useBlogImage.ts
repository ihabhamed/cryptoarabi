
import { useImageSelection } from './image/useImageSelection';
import { useImageUpload } from './image/useImageUpload';
import { useImagePersistence } from './image/useImagePersistence';
import { useImageValidation } from './image/useImageValidation';
import { 
  cleanImageUrl, 
  shouldClearImageUrl, 
  recoverImageFromStorage,
  isBlobUrlValid,
  addTimestampToUrl
} from './utils/image/imageValidation';
import { 
  addTimestampToUrl as addTimestamp 
} from './utils/image/imageProcessing';
import { 
  recoverImageFromStorage as recoverImage 
} from './utils/image/imageStorage';

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
      // Make sure to store in session storage as well
      persistImageData(imageUrl, false);
    }
    return imageUrl;
  };

  // Improved function to set initial image preview with better validation
  const setImagePreview = async (url: string | null) => {
    if (!isEmptyOrInvalidUrlString(url)) {
      const cleanedUrl = cleanImageUrl(url as string);
      console.log(`[useBlogImage] Setting image preview with cleaned URL: ${cleanedUrl}`);
      
      // Check if it's a blob URL and if it's still valid
      if (cleanedUrl.startsWith('blob:')) {
        const isValid = await isBlobUrlValid(cleanedUrl);
        if (isValid) {
          console.log(`[useBlogImage] Blob URL is valid: ${cleanedUrl}`);
          setInitialImagePreview(cleanedUrl);
          return;
        } else {
          console.warn(`[useBlogImage] Blob URL is no longer valid: ${cleanedUrl}`);
          // Try to recover from session storage
          const recoveredUrl = recoverImage();
          if (recoveredUrl && recoveredUrl !== cleanedUrl) {
            console.log(`[useBlogImage] Falling back to recovered URL: ${recoveredUrl}`);
            setInitialImagePreview(recoveredUrl);
            return;
          }
          // If no recovery, set to null
          setPreviewUrl(null);
          return;
        }
      }
      
      setInitialImagePreview(cleanedUrl);
      
      // Validate if the image can be loaded
      validateImageUrl(cleanedUrl).then(isValid => {
        if (!isValid) {
          console.warn(`[useBlogImage] Warning: Image URL validation failed for: ${cleanedUrl}`);
          
          // Try adding a timestamp to force a reload
          const timestampedUrl = addTimestamp(cleanedUrl);
          console.log(`[useBlogImage] Trying with timestamp: ${timestampedUrl}`);
          
          validateImageUrl(timestampedUrl).then(isValidWithTimestamp => {
            if (isValidWithTimestamp) {
              console.log(`[useBlogImage] Image loaded successfully with timestamp: ${timestampedUrl}`);
              setInitialImagePreview(timestampedUrl);
            } else {
              // Try to recover from session storage as fallback
              const recoveredUrl = recoverImage();
              if (recoveredUrl && recoveredUrl !== cleanedUrl) {
                console.log(`[useBlogImage] Falling back to recovered URL: ${recoveredUrl}`);
                setInitialImagePreview(recoveredUrl);
              }
            }
          });
        }
      });
    } else if (!previewUrl) {
      // Try to recover from session storage if no URL provided
      const recoveredUrl = recoverImage();
      if (recoveredUrl) {
        console.log(`[useBlogImage] Recovered image from storage: ${recoveredUrl}`);
        
        // If it's a blob URL, check if it's still valid
        if (recoveredUrl.startsWith('blob:')) {
          const isValid = await isBlobUrlValid(recoveredUrl);
          if (isValid) {
            console.log(`[useBlogImage] Recovered blob URL is valid: ${recoveredUrl}`);
            setInitialImagePreview(recoveredUrl);
          } else {
            console.warn(`[useBlogImage] Recovered blob URL is no longer valid: ${recoveredUrl}`);
            setPreviewUrl(null);
          }
        } else {
          setInitialImagePreview(recoveredUrl);
        }
      } else {
        console.log(`[useBlogImage] Not setting image preview - invalid URL: ${url || 'NULL'}`);
        setPreviewUrl(null);
      }
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
