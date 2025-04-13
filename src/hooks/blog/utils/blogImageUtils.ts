
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
  if (!isValidImageUrl(url)) {
    console.log("Setting image_url to null before saving");
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
