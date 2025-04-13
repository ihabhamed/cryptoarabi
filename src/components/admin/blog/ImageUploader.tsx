
import React, { useEffect, useRef } from 'react';
import { toast } from "@/lib/utils/toast-utils";
import { isValidImageUrl } from '@/hooks/blog/utils/image/imageValidation';
import { isBlobUrlValid } from '@/hooks/blog/utils/image/imageValidation';
import { recoverImageFromStorage } from '@/hooks/blog/utils/image/imageStorage';
import ImagePreview from './components/ImagePreview';
import ImageUploadInput from './components/ImageUploadInput';
import ImageUrlInput from './components/ImageUrlInput';

interface ImageUploaderProps {
  previewUrl: string | null;
  onImageChange: (file: File | null) => void;
  onImageUrlChange: (url: string) => void;
  onRemoveImage: () => void;
  imageUrl: string;
  isUploading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  previewUrl,
  onImageChange,
  onImageUrlChange,
  onRemoveImage,
  imageUrl,
  isUploading
}) => {
  const recoveryAttempted = useRef(false);
  
  // Debug when imageUrl or previewUrl changes
  useEffect(() => {
    console.log(`[ImageUploader] imageUrl prop: "${imageUrl || 'NULL'}", previewUrl: "${previewUrl || 'NULL'}"`);
  }, [imageUrl, previewUrl]);
  
  // When component mounts, try to recover image from storage if needed
  useEffect(() => {
    if (!previewUrl && !imageUrl && !recoveryAttempted.current) {
      recoveryAttempted.current = true;
      const recoveredUrl = recoverImageFromStorage();
      if (recoveredUrl) {
        console.log(`[ImageUploader] Recovered image URL on mount: ${recoveredUrl}`);
        
        // Special check for blob URLs to verify they're still valid
        if (recoveredUrl.startsWith('blob:')) {
          isBlobUrlValid(recoveredUrl).then(isValid => {
            if (isValid) {
              console.log(`[ImageUploader] Recovered blob URL is valid: ${recoveredUrl}`);
              onImageUrlChange(recoveredUrl);
            } else {
              console.warn(`[ImageUploader] Recovered blob URL is no longer valid: ${recoveredUrl}`);
              // Don't do anything, let the user select a new image
            }
          });
        } else {
          onImageUrlChange(recoveredUrl);
        }
      }
    }
  }, []);
  
  // When tab visibility changes, ensure the image is still displayed
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('[ImageUploader] Tab visible again, checking images');
        
        // First check if we have a valid previewUrl
        if (!previewUrl) {
          // Check if imageUrl is valid
          if (imageUrl && isValidImageUrl(imageUrl)) {
            console.log(`[ImageUploader] Using valid imageUrl: ${imageUrl}`);
            // Need to check if it's a blob URL first
            if (imageUrl.startsWith('blob:')) {
              isBlobUrlValid(imageUrl).then(isValid => {
                if (isValid) {
                  console.log(`[ImageUploader] Blob URL is still valid: ${imageUrl}`);
                  onImageUrlChange(imageUrl);
                } else {
                  console.warn(`[ImageUploader] Blob URL is no longer valid: ${imageUrl}`);
                  
                  // Try to recover from sessionStorage as last resort
                  const recoveredUrl = recoverImageFromStorage();
                  if (recoveredUrl && recoveredUrl !== imageUrl) {
                    console.log(`[ImageUploader] Recovered alternative image from storage: ${recoveredUrl}`);
                    if (recoveredUrl.startsWith('blob:')) {
                      isBlobUrlValid(recoveredUrl).then(isRecoveredValid => {
                        if (isRecoveredValid) {
                          onImageUrlChange(recoveredUrl);
                        }
                      });
                    } else {
                      onImageUrlChange(recoveredUrl);
                    }
                  }
                }
              });
            } else {
              onImageUrlChange(imageUrl);
            }
          } else {
            // Try to recover from sessionStorage as last resort
            const recoveredUrl = recoverImageFromStorage();
            if (recoveredUrl) {
              console.log(`[ImageUploader] Recovered image from storage: ${recoveredUrl}`);
              
              // Check if blob URL is still valid
              if (recoveredUrl.startsWith('blob:')) {
                isBlobUrlValid(recoveredUrl).then(isValid => {
                  if (isValid) {
                    onImageUrlChange(recoveredUrl);
                  }
                });
              } else {
                onImageUrlChange(recoveredUrl);
              }
            }
          }
        } else if (previewUrl.startsWith('blob:')) {
          // Verify the blob URL is still valid
          isBlobUrlValid(previewUrl).then(isValid => {
            if (!isValid) {
              console.warn(`[ImageUploader] Current previewUrl blob is no longer valid: ${previewUrl}`);
              
              // Try to recover
              const recoveredUrl = recoverImageFromStorage();
              if (recoveredUrl && recoveredUrl !== previewUrl) {
                console.log(`[ImageUploader] Using alternative recovered URL: ${recoveredUrl}`);
                onImageUrlChange(recoveredUrl);
              }
            }
          });
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also handle navigation events
    const handleRouteChange = () => {
      setTimeout(handleVisibilityChange, 100);
    };
    
    const handleWindowFocus = () => {
      console.log('[ImageUploader] Window focused, checking image state');
      handleVisibilityChange();
    };
    
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('focus', handleWindowFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [imageUrl, previewUrl, onImageUrlChange]);

  // Handle retry loading the image
  const handleRetryLoad = () => {
    if (previewUrl) {
      // Force a reload by adding a timestamp parameter
      const timestamp = new Date().getTime();
      const urlWithTimestamp = previewUrl.includes('?') 
        ? `${previewUrl}&t=${timestamp}` 
        : `${previewUrl}?t=${timestamp}`;
      
      // If it's a blob URL, check if it's still valid
      if (previewUrl.startsWith('blob:')) {
        isBlobUrlValid(previewUrl).then(isValid => {
          if (isValid) {
            console.log(`[ImageUploader] Blob URL is still valid, using with timestamp: ${urlWithTimestamp}`);
            onImageUrlChange(urlWithTimestamp);
          } else {
            console.warn(`[ImageUploader] Blob URL is no longer valid: ${previewUrl}`);
            
            // Try to recover from session storage
            const recoveredUrl = recoverImageFromStorage();
            if (recoveredUrl && recoveredUrl !== previewUrl) {
              console.log(`[ImageUploader] Recovered image on retry: ${recoveredUrl}`);
              onImageUrlChange(recoveredUrl);
            } else {
              // Clear the invalid image
              onRemoveImage();
              toast({
                variant: "warning",
                title: "تعذر تحميل الصورة",
                description: "يرجى إعادة اختيار الصورة",
              });
            }
          }
        });
      } else {
        onImageUrlChange(urlWithTimestamp);
        
        toast({
          title: "جاري إعادة تحميل الصورة",
          description: "يرجى الانتظار قليلاً...",
        });
      }
    } else {
      // Try to recover from session storage
      const recoveredUrl = recoverImageFromStorage();
      if (recoveredUrl) {
        console.log(`[ImageUploader] Recovered image on retry: ${recoveredUrl}`);
        
        // Verify if it's a blob URL
        if (recoveredUrl.startsWith('blob:')) {
          isBlobUrlValid(recoveredUrl).then(isValid => {
            if (isValid) {
              onImageUrlChange(recoveredUrl);
            } else {
              // Clear the invalid image
              toast({
                variant: "warning",
                title: "تعذر استعادة الصورة",
                description: "يرجى إعادة اختيار الصورة",
              });
            }
          });
        } else {
          onImageUrlChange(recoveredUrl);
        }
      }
    }
  };

  return (
    <div>
      <label className="block text-white mb-2">صورة المنشور</label>
      
      {/* Image Preview */}
      {previewUrl && (
        <ImagePreview 
          previewUrl={previewUrl}
          onRemoveImage={onRemoveImage}
          onRetryLoad={handleRetryLoad}
        />
      )}
      
      <div className="flex flex-col gap-3">
        {/* File Upload */}
        <ImageUploadInput 
          onImageChange={onImageChange}
          isUploading={isUploading}
        />
        
        {/* URL Input */}
        <ImageUrlInput 
          imageUrl={imageUrl}
          onImageUrlChange={onImageUrlChange}
          onRemoveImage={onRemoveImage}
          isUploading={isUploading}
        />
      </div>
      <p className="text-xs text-gray-400 mt-1">يسمح بالصور بحجم أقصى 2 ميغابايت، بصيغة JPG، PNG، GIF أو WEBP.</p>
    </div>
  );
};

export default ImageUploader;
