
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
