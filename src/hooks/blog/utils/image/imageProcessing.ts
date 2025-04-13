
/**
 * Utilities for processing and cleaning image URLs
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
 * Processes image URL for storage (handles null, undefined, empty strings)
 */
export const processImageUrlForStorage = (url: string | null | undefined): string | null => {
  // Additional logging to track the image URL being processed
  console.log(`Processing image URL for storage: "${url || 'NULL'}"`);
  
  // Blob URLs should not be stored in the database as they're temporary
  if (url && (url.startsWith('blob:') || url.startsWith('data:'))) {
    console.log("Blog URL detected, not storing in database");
    return null;
  }
  
  if (!isValidImageUrl(url)) {
    console.log("Setting image_url to null before saving - invalid URL");
    return null;
  }
  
  if (typeof url === 'string' && url.includes('?')) {
    const urlWithoutParams = cleanImageUrl(url);
    console.log(`Removing query parameters from image URL: ${url} -> ${urlWithoutParams}`);
    return urlWithoutParams;
  }
  
  console.log(`Validated image URL for saving: '${url}'`);
  return url as string;
};

/**
 * Properly normalizes image URL from various sources
 * This ensures consistent URL handling when coming from file upload vs direct URL input
 */
export const normalizeImageUrl = (url: string | null): string | null => {
  // Import shouldClearImageUrl inline to avoid circular dependencies
  const shouldClearImageUrl = (url: string | null | undefined): boolean => {
    if (!url) return true;
    if (url === 'null' || url === 'undefined' || url.trim() === '') return true;
    return false;
  };
  
  if (shouldClearImageUrl(url)) return null;
  
  // Don't modify blob URLs
  if (url && (url.startsWith('blob:') || url.startsWith('data:'))) {
    return url;
  }
  
  // If URL contains storage path but needs adjustment
  if (url && url.includes('images/')) {
    // Make sure the URL is properly formatted
    if (!url.startsWith('http')) {
      // Assuming Supabase storage URL pattern
      return `https://tlpiqkbiwcdyzpqqzsbg.supabase.co/storage/v1/object/public/${url}`;
    }
  }
  
  return url;
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
