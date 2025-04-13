
/**
 * Utilities for handling image fallbacks and error states
 */

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
 * Properly normalizes image URL from various sources
 * This ensures consistent URL handling when coming from file upload vs direct URL input
 */
export const normalizeImageUrl = (url: string | null): string | null => {
  // Import shouldClearImageUrl function inline to avoid circular dependencies
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
