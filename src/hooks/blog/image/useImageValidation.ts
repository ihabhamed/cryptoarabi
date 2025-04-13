
/**
 * Hook for validating image URLs and checking if they can be loaded
 */
export function useImageValidation() {
  // Test for direct validating if the image can be loaded
  const validateImageUrl = async (url: string): Promise<boolean> => {
    if (!url || url === 'null' || url === 'undefined' || url.trim() === '') {
      console.log('[useImageValidation] validateImageUrl: URL is invalid or empty');
      return false;
    }
    
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        console.log(`[useImageValidation] validateImageUrl: Image loaded successfully: ${url}`);
        resolve(true);
      };
      img.onerror = () => {
        console.log(`[useImageValidation] validateImageUrl: Image failed to load: ${url}`);
        resolve(false);
      };
      img.src = url;
    });
  };

  return {
    validateImageUrl
  };
}
