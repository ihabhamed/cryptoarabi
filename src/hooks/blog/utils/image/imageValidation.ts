
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
