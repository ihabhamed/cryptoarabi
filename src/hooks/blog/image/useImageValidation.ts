
import { addTimestampToUrl, isValidImageUrl } from '../utils/image/imageProcessing';

/**
 * Hook for validating image URLs and checking if they can be loaded
 */
export function useImageValidation() {
  // Test for direct validating if the image can be loaded
  const validateImageUrl = async (url: string): Promise<boolean> => {
    if (!isValidImageUrl(url)) {
      console.log('[useImageValidation] validateImageUrl: URL is invalid or empty');
      return false;
    }

    // Handle object URLs (from file inputs) differently - they are always valid
    // but can't be validated with a network request in the background
    if (url.startsWith('blob:') || url.startsWith('data:')) {
      console.log(`[useImageValidation] validateImageUrl: Using object URL, assuming valid: ${url.substring(0, 50)}...`);
      
      // Special check for blob URLs to verify they're still valid
      if (url.startsWith('blob:')) {
        try {
          const response = await fetch(url, { method: 'HEAD', cache: 'no-store' });
          if (!response.ok) {
            console.log(`[useImageValidation] validateImageUrl: Blob URL is no longer valid: ${url.substring(0, 50)}...`);
            return false;
          }
        } catch (e) {
          console.log(`[useImageValidation] validateImageUrl: Error checking blob URL: ${url.substring(0, 50)}...`);
          return false;
        }
      }
      
      return true;
    }

    // Clean the URL by removing any query parameters
    const cleanUrl = url.includes('?') ? url.split('?')[0] : url;
    console.log(`[useImageValidation] validateImageUrl: Testing cleaned URL: ${cleanUrl}`);
    
    return new Promise((resolve) => {
      const img = new Image();
      const timeoutId = setTimeout(() => {
        console.log(`[useImageValidation] validateImageUrl: Image load timed out: ${cleanUrl}`);
        img.src = ''; // Cancel the image request
        resolve(false);
      }, 10000); // 10 second timeout for slow connections
      
      img.onload = () => {
        clearTimeout(timeoutId);
        console.log(`[useImageValidation] validateImageUrl: Image loaded successfully: ${cleanUrl}`);
        resolve(true);
      };
      
      img.onerror = () => {
        clearTimeout(timeoutId);
        console.log(`[useImageValidation] validateImageUrl: Image failed to load: ${cleanUrl}`);
        resolve(false);
      };
      
      // Set crossOrigin attribute for CORS issues with certain domains
      img.crossOrigin = 'anonymous';
      
      // Bypass cache by adding a timestamp for better testing
      const cacheBuster = addTimestampToUrl(cleanUrl);
      img.src = cacheBuster;
    });
  };

  // Check if a URL is properly formatted
  const isValidUrl = (url: string | null | undefined): boolean => {
    return isValidImageUrl(url);
  };

  // Check if a value is an empty or invalid URL string
  const isEmptyOrInvalidUrlString = (url: string | null | undefined): boolean => {
    return !url || 
           url === 'null' || 
           url === 'undefined' || 
           url.trim() === '' || 
           url.toLowerCase() === 'null';
  };

  return {
    validateImageUrl,
    isValidUrl,
    isEmptyOrInvalidUrlString
  };
}
