
/**
 * Utilities for storing and recovering image data in browser storage
 */

/**
 * Attempt to recover image data from session storage
 * Returns the image URL if found, null otherwise
 */
export const recoverImageFromStorage = (): string | null => {
  const savedImageUrl = sessionStorage.getItem('blogImageUrl');
  const isFile = sessionStorage.getItem('blogImageIsFile') === 'true';
  const isBlob = sessionStorage.getItem('blogImageIsBlob') === 'true';
  
  // Import from imageValidation
  const shouldClearImageUrl = (url: string | null | undefined): boolean => {
    if (!url) return true;
    if (url === 'null' || url === 'undefined' || url.trim() === '') return true;
    return false;
  };
  
  if (savedImageUrl && !shouldClearImageUrl(savedImageUrl)) {
    console.log(`Recovered image URL from session storage: ${savedImageUrl}`);
    
    return savedImageUrl;
  }
  return null;
};

/**
 * Create a mock blob URL for testing if needed
 * This is useful for development and debugging
 */
export const createMockBlobUrl = (): string => {
  // Create a small transparent pixel as a blob
  const base64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  const byteString = atob(base64Data);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const intArray = new Uint8Array(arrayBuffer);
  
  for (let i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i);
  }
  
  const blob = new Blob([arrayBuffer], { type: 'image/png' });
  return URL.createObjectURL(blob);
};
