
import { useEffect } from 'react';
import { shouldClearImageUrl, cleanImageUrl } from '../utils/blogImageUtils';

/**
 * Hook to handle image persistence across tab switches and visibility changes
 */
export function useImagePersistence(previewUrl: string | null, setPreviewUrl: (url: string | null) => void) {
  // Persist image data in sessionStorage with improved reliability
  const persistImageData = (imageUrl: string | null, isFile: boolean = false) => {
    if (imageUrl && !shouldClearImageUrl(imageUrl)) {
      console.log(`[useImagePersistence] Persisting image to sessionStorage: ${imageUrl}`);
      sessionStorage.setItem('blogImageUrl', imageUrl);
      sessionStorage.setItem('blogImageIsFile', isFile ? 'true' : 'false');
      // Also store timestamp to track when the image was saved
      sessionStorage.setItem('blogImageTimestamp', new Date().getTime().toString());
    } else {
      console.log('[useImagePersistence] Clearing image from sessionStorage');
      // Don't actually remove items here, just log the intent
      // We'll handle removal after a successful submission
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
      // Check if we have a saved image in sessionStorage before clearing
      const savedImageUrl = sessionStorage.getItem('blogImageUrl');
      if (!savedImageUrl || shouldClearImageUrl(savedImageUrl)) {
        console.log(`[useImagePersistence] Invalid URL provided to setInitialImagePreview: ${url || 'NULL'}`);
        setPreviewUrl(null);
      }
    }
  };

  // Restore image from session storage when component mounts or tab is switched back
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const savedImageUrl = sessionStorage.getItem('blogImageUrl');
        const isFile = sessionStorage.getItem('blogImageIsFile') === 'true';
        
        if (savedImageUrl && !shouldClearImageUrl(savedImageUrl) && (!previewUrl || previewUrl !== savedImageUrl)) {
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
    
    // Check on component mount - important for returning to the page
    handleVisibilityChange();
    
    // Add visibility change listener
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Add additional event listeners for tab/window focus and blur
    const handleWindowBlur = () => {
      if (previewUrl && !shouldClearImageUrl(previewUrl)) {
        console.log(`[useImagePersistence] Saving image on window blur: ${previewUrl}`);
        persistImageData(previewUrl);
      }
    };
    
    const handleWindowFocus = () => {
      const savedImageUrl = sessionStorage.getItem('blogImageUrl');
      if (savedImageUrl && !shouldClearImageUrl(savedImageUrl) && (!previewUrl || previewUrl !== savedImageUrl)) {
        console.log(`[useImagePersistence] Restoring image on window focus: ${savedImageUrl}`);
        setPreviewUrl(savedImageUrl);
      }
    };
    
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    
    // Additional check on navigation events using the History API
    const handlePopState = () => {
      console.log('[useImagePersistence] Navigation detected, checking for saved images');
      setTimeout(() => {
        const savedImageUrl = sessionStorage.getItem('blogImageUrl');
        if (savedImageUrl && !shouldClearImageUrl(savedImageUrl) && (!previewUrl || previewUrl !== savedImageUrl)) {
          console.log(`[useImagePersistence] Restoring image after navigation: ${savedImageUrl}`);
          setPreviewUrl(savedImageUrl);
        }
      }, 100); // Small delay to ensure DOM is settled
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [previewUrl, setPreviewUrl]);

  return {
    persistImageData,
    setInitialImagePreview
  };
}
