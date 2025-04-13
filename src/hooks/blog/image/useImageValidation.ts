
/**
 * Hook for validating image URLs and checking if they can be loaded
 */
export function useImageValidation() {
  // Test for direct validating if the image can be loaded
  const validateImageUrl = async (url: string): Promise<boolean> => {
    if (!url || url === 'null' || url === 'undefined' || url.trim() === '' || url.toLowerCase() === 'null') {
      console.log('[useImageValidation] validateImageUrl: URL is invalid or empty');
      return false;
    }

    // Handle object URLs (from file inputs) differently - they are always valid
    // but can't be validated with a network request in the background
    if (url.startsWith('blob:') || url.startsWith('data:')) {
      console.log(`[useImageValidation] validateImageUrl: Using object URL, assuming valid: ${url.substring(0, 50)}...`);
      return true;
    }

    // Clean the URL by removing any query parameters
    const cleanUrl = url.includes('?') ? url.split('?')[0] : url;
    console.log(`[useImageValidation] validateImageUrl: Testing cleaned URL: ${cleanUrl}`);
    
    return new Promise((resolve) => {
      const img = new Image();
      const timeoutId = setTimeout(() => {
        console.log(`[useImageValidation] validateImageUrl: Image load timed out: ${cleanUrl}`);
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
      
      img.src = cleanUrl;
    });
  };

  // Check if a URL is properly formatted
  const isValidUrl = (url: string | null | undefined): boolean => {
    if (!url || url === 'null' || url === 'undefined' || url.trim() === '' || url.toLowerCase() === 'null') {
      return false;
    }

    // Object URLs are always considered valid
    if (url.startsWith('blob:') || url.startsWith('data:')) {
      return true;
    }
    
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
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
