
import React, { useEffect } from 'react';
import { toast } from "@/lib/utils/toast-utils";
import { isValidImageUrl, recoverImageFromStorage } from '@/hooks/blog/utils/blogImageUtils';
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
  // Debug when imageUrl or previewUrl changes
  useEffect(() => {
    console.log(`[ImageUploader] imageUrl prop: "${imageUrl || 'NULL'}", previewUrl: "${previewUrl || 'NULL'}"`);
  }, [imageUrl, previewUrl]);
  
  // When component mounts, try to recover image from storage if needed
  useEffect(() => {
    if (!previewUrl && !imageUrl) {
      const recoveredUrl = recoverImageFromStorage();
      if (recoveredUrl) {
        console.log(`[ImageUploader] Recovered image URL on mount: ${recoveredUrl}`);
        onImageUrlChange(recoveredUrl);
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
            onImageUrlChange(imageUrl);
          } else {
            // Try to recover from sessionStorage as last resort
            const recoveredUrl = recoverImageFromStorage();
            if (recoveredUrl) {
              console.log(`[ImageUploader] Recovered image from storage: ${recoveredUrl}`);
              onImageUrlChange(recoveredUrl);
            }
          }
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also handle navigation events
    const handleRouteChange = () => {
      setTimeout(handleVisibilityChange, 100);
    };
    
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', handleRouteChange);
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
      onImageUrlChange(urlWithTimestamp);
      
      toast({
        title: "جاري إعادة تحميل الصورة",
        description: "يرجى الانتظار قليلاً...",
      });
    } else {
      // Try to recover from session storage
      const recoveredUrl = recoverImageFromStorage();
      if (recoveredUrl) {
        console.log(`[ImageUploader] Recovered image on retry: ${recoveredUrl}`);
        onImageUrlChange(recoveredUrl);
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
