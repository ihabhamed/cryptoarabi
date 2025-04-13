
import { useEffect } from 'react';
import { shouldClearImageUrl, cleanImageUrl } from '../utils/blogImageUtils';

/**
 * Hook to handle image persistence across tab switches and visibility changes
 */
export function useImagePersistence(previewUrl: string | null, setPreviewUrl: (url: string | null) => void) {
  // Persist image data in sessionStorage
  const persistImageData = (imageUrl: string | null, isFile: boolean = false) => {
    if (imageUrl && !shouldClearImageUrl(imageUrl)) {
      console.log(`[useImagePersistence] Persisting image to sessionStorage: ${imageUrl}`);
      sessionStorage.setItem('blogImageUrl', imageUrl);
      sessionStorage.setItem('blogImageIsFile', isFile ? 'true' : 'false');
      // Also store timestamp to track when the image was saved
      sessionStorage.setItem('blogImageTimestamp', new Date().getTime().toString());
    } else {
      console.log('[useImagePersistence] Clearing image from sessionStorage');
      sessionStorage.removeItem('blogImageUrl');
      sessionStorage.removeItem('blogImageIsFile');
      sessionStorage.removeItem('blogImageTimestamp');
    }
  };

  // Set initial image preview (used when loading existing blog post)
  const setInitialImagePreview = (url: string | null) => {
    console.log(`[useImagePersistence] setInitialImagePreview called with: ${url || 'NULL'}`);
    if (url && !shouldClearImageUrl(url)) {
      // Remove any query parameters to prevent caching issues
      const cleanUrl = url.includes('?') ? cleanImageUrl(url) : url;
      console.log(`[useImagePersistence] Setting initial image preview: ${cleanUrl}`);
      
      setPreviewUrl(cleanUrl);
      persistImageData(cleanUrl);
    } else {
      console.log(`[useImagePersistence] Invalid URL provided to setInitialImagePreview: ${url || 'NULL'}`);
      // Clear the preview if URL is invalid
      setPreviewUrl(null);
      persistImageData(null);
    }
  };

  // Restore image from session storage when component mounts or tab is switched back
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const savedImageUrl = sessionStorage.getItem('blogImageUrl');
        const isFile = sessionStorage.getItem('blogImageIsFile') === 'true';
        
        if (savedImageUrl && !shouldClearImageUrl(savedImageUrl) && !previewUrl) {
          console.log(`[useImagePersistence] Restoring image from sessionStorage: ${savedImageUrl}`);
          setPreviewUrl(savedImageUrl);
        }
      } else {
        // When tab is hidden, make sure to save current image
        if (previewUrl && !shouldClearImageUrl(previewUrl)) {
          console.log(`[useImagePersistence] Saving image before tab hidden: ${previewUrl}`);
          persistImageData(previewUrl);
        }
      }
    };
    
    // Check on component mount
    handleVisibilityChange();
    
    // Also add visibility change listener
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Add additional event listeners for tab/window focus and blur
    window.addEventListener('blur', () => {
      if (previewUrl && !shouldClearImageUrl(previewUrl)) {
        console.log(`[useImagePersistence] Saving image on window blur: ${previewUrl}`);
        persistImageData(previewUrl);
      }
    });
    
    window.addEventListener('focus', () => {
      const savedImageUrl = sessionStorage.getItem('blogImageUrl');
      if (savedImageUrl && !shouldClearImageUrl(savedImageUrl) && !previewUrl) {
        console.log(`[useImagePersistence] Restoring image on window focus: ${savedImageUrl}`);
        setPreviewUrl(savedImageUrl);
      }
    });
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', () => {});
      window.removeEventListener('focus', () => {});
    };
  }, [previewUrl, setPreviewUrl]);

  return {
    persistImageData,
    setInitialImagePreview
  };
}
