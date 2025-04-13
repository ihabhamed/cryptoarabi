
/**
 * Main entry point for blog image utilities
 * This file re-exports all functionality from the specialized modules
 */

// Re-export everything from specialized modules with explicit names to avoid ambiguity
export { 
  isValidImageUrl,
  shouldClearImageUrl,
  ensureNotNullString,
  isBlobUrlValid,
  cleanImageUrl,
  recoverImageFromStorage
} from './image/imageValidation';

export {
  processImageUrlForStorage,
  normalizeImageUrl
} from './image/imageProcessing';

export {
  getFallbackImageUrl,
  handleImageError
} from './image/imageFallback';

export {
  createMockBlobUrl
} from './image/imageStorage';

// Export addTimestampToUrl from imageProcessing to prevent ambiguity
export { addTimestampToUrl } from './image/imageProcessing';
