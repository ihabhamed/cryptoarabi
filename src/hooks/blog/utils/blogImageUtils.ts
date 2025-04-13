
/**
 * Utilities for blog image URL handling and validation
 */

/**
 * Validates if an image URL is properly formatted and not null/undefined/empty
 */
export const isValidImageUrl = (url: string | null | undefined): boolean => {
  if (!url || url === 'null' || url === 'undefined' || url.trim() === '') {
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
  if (url.includes('?')) {
    return url.split('?')[0];
  }
  return url;
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
