
/**
 * Utilities for validating image URLs
 */

/**
 * Validates if an image URL is properly formatted and not null/undefined/empty
 */
export const isValidImageUrl = (url: string | null | undefined): boolean => {
  if (!url || url === 'null' || url === 'undefined' || url.trim() === '' || url.toLowerCase() === 'null') {
    return false;
  }
  
  // Object URLs are always considered valid since they can't be checked the same way
  if (url.startsWith('blob:') || url.startsWith('data:')) {
    return true;
  }
  
  // Check if it's a properly formatted URL
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Determines if image URL needs to be cleared (is an invalid format)
 */
export const shouldClearImageUrl = (url: string | null | undefined): boolean => {
  if (!url) return true;
  if (url === 'null' || url === 'undefined' || url.trim() === '') return true;
  return false;
};

/**
 * Ensures a string is not a "null" string
 */
export const ensureNotNullString = (value: string | null | undefined): string | null => {
  if (!value) return null;
  if (value === 'null' || value === 'undefined' || value.trim() === '') return null;
  return value;
};

/**
 * Check if a blob URL is still valid
 * Returns a promise that resolves to true if valid, false if not
 */
export const isBlobUrlValid = async (url: string): Promise<boolean> => {
  if (!url.startsWith('blob:')) return false;
  
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      cache: 'no-store' // Important to avoid cached results
    });
    return response.ok;
  } catch (e) {
    console.error('Error checking blob URL validity:', e);
    return false;
  }
};

/**
 * Cleans image URL by removing query parameters
 */
export const cleanImageUrl = (url: string): string => {
  if (!url) return '';
  
  // Don't modify blob URLs or data URLs
  if (url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  
  try {
    // Remove query parameters
    if (url.includes('?')) {
      return url.split('?')[0];
    }
    return url;
  } catch (e) {
    console.error('Error cleaning image URL:', e);
    return url;
  }
};

/**
 * Adds a timestamp to a URL to force a refresh
 * Useful for forcing image reload after cache issues
 */
export const addTimestampToUrl = (url: string): string => {
  if (!url) return url;
  
  // Don't modify blob URLs
  if (url.startsWith('blob:') || url.startsWith('data:')) return url;
  
  const timestamp = new Date().getTime();
  return url.includes('?') 
    ? `${url}&t=${timestamp}` 
    : `${url}?t=${timestamp}`;
};

/**
 * Attempt to recover image data from session storage
 * Returns the image URL if found, null otherwise
 */
export const recoverImageFromStorage = (): string | null => {
  const savedImageUrl = sessionStorage.getItem('blogImageUrl');
  const isFile = sessionStorage.getItem('blogImageIsFile') === 'true';
  const isBlob = sessionStorage.getItem('blogImageIsBlob') === 'true';
  
  if (savedImageUrl && !shouldClearImageUrl(savedImageUrl)) {
    console.log(`Recovered image URL from session storage: ${savedImageUrl}`);
    
    return savedImageUrl;
  }
  return null;
};
