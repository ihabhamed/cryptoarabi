
/**
 * Utilities for blog image URL handling and validation
 */

/**
 * Validates if an image URL is properly formatted and not null/undefined/empty
 */
export const isValidImageUrl = (url: string | null | undefined): boolean => {
  if (!url || url === 'null' || url === 'undefined' || url.trim() === '' || url.toLowerCase() === 'null') {
    return false;
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
 * Gets a fallback image URL for when the main image fails to load
 */
export const getFallbackImageUrl = (): string => {
  return 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80';
};

/**
 * Handles image load errors by providing a fallback image
 */
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>, postTitle?: string): void => {
  const target = event.target as HTMLImageElement;
  console.error(`Image loading error for post "${postTitle || 'unknown'}": ${target.src}`);
  target.src = getFallbackImageUrl();
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
 * Determines if image URL needs to be cleared (is an invalid format)
 */
export const shouldClearImageUrl = (url: string | null | undefined): boolean => {
  if (!url) return true;
  if (url === 'null' || url === 'undefined' || url.trim() === '') return true;
  return false;
};

/**
 * Properly normalizes image URL from various sources
 * This ensures consistent URL handling when coming from file upload vs direct URL input
 */
export const normalizeImageUrl = (url: string | null): string | null => {
  if (shouldClearImageUrl(url)) return null;
  
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
 * Attempt to recover image data from session storage
 * Returns the image URL if found, null otherwise
 */
export const recoverImageFromStorage = (): string | null => {
  const savedImageUrl = sessionStorage.getItem('blogImageUrl');
  if (savedImageUrl && !shouldClearImageUrl(savedImageUrl)) {
    console.log(`Recovered image URL from session storage: ${savedImageUrl}`);
    return savedImageUrl;
  }
  return null;
};
