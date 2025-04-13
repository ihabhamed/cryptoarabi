
import { useState } from 'react';
import { isValidImageUrl as validateUrl } from '../utils/blogImageUtils';

/**
 * Hook to validate image URLs
 */
export function useImageValidation() {
  const [isValidUrl, setIsValidUrl] = useState<boolean>(false);
  
  // Validate an image URL by attempting to load it
  const validateImageUrl = async (url: string): Promise<boolean> => {
    if (!validateUrl(url)) {
      console.log(`[useImageValidation] URL is not valid format: ${url}`);
      setIsValidUrl(false);
      return false;
    }
    
    // For blob URLs, which are always local, assume they're valid
    if (url.startsWith('blob:') || url.startsWith('data:')) {
      console.log(`[useImageValidation] Blob/Data URL assumed valid: ${url}`);
      setIsValidUrl(true);
      return true;
    }
    
    // For regular URLs, try to load the image
    return new Promise((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        console.log(`[useImageValidation] Image loaded successfully: ${url}`);
        setIsValidUrl(true);
        resolve(true);
      };
      
      img.onerror = () => {
        console.warn(`[useImageValidation] Failed to load image: ${url}`);
        setIsValidUrl(false);
        resolve(false);
      };
      
      // Add a timestamp to prevent caching issues during validation
      const timestamp = new Date().getTime();
      const urlWithTimestamp = url.includes('?') 
        ? `${url}&t=${timestamp}` 
        : `${url}?t=${timestamp}`;
      
      img.src = urlWithTimestamp;
    });
  };
  
  // Simple check for empty or invalid URL strings
  const isEmptyOrInvalidUrlString = (url: string | null | undefined): boolean => {
    if (!url) return true;
    if (url === 'null' || url === 'undefined' || url.trim() === '') return true;
    return false;
  };
  
  return {
    validateImageUrl,
    isValidUrl,
    isEmptyOrInvalidUrlString
  };
}
