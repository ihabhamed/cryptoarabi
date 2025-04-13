
import { BlogPost } from '@/types/supabase';
import { processImageUrlForStorage } from './blogImageUtils';

/**
 * Creates a clean blog data object with proper defaults for database operations
 */
export const createCleanBlogData = (blogData: Partial<BlogPost>): Partial<BlogPost> => {
  // Process image URL
  const imageUrl = processImageUrlForStorage(blogData.image_url);

  // Generate defaults for required fields
  return {
    title: blogData.title,
    content: blogData.content,
    excerpt: blogData.excerpt || null,
    author: blogData.author || null,
    category: blogData.category || null,
    slug: blogData.slug, // Should be guaranteed to have a value by the caller
    image_url: imageUrl, // Now properly handled for null cases
    publish_date: blogData.publish_date || new Date().toISOString(),
    meta_title: blogData.meta_title || null,
    meta_description: blogData.meta_description || null,
    hashtags: blogData.hashtags || null
  };
};

/**
 * Validates required blog data fields
 */
export const validateBlogData = (blogData: Partial<BlogPost>): boolean => {
  if (!blogData.title || !blogData.content) {
    console.error("Missing required fields. Title:", blogData.title, "Content length:", blogData.content?.length);
    return false;
  }
  return true;
};

/**
 * Generates a unique slug for a blog post
 */
export const generateUniqueSlug = (title: string | undefined): string => {
  // Generate a timestamp-based slug for uniqueness
  const timestamp = new Date().getTime().toString().slice(-8);
  
  // Check if title contains Arabic characters
  if (title && /[\u0600-\u06FF]/.test(title)) {
    // For Arabic titles, create a generic slug with timestamp
    return `post-${timestamp}`;
  } else if (title) {
    // For non-Arabic titles, create a slug from the title
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-')      // Replace multiple hyphens with a single one
      .replace(/^-+|-+$/g, '')  // Remove hyphens from start and end
      .concat(`-${timestamp}`);  // Add timestamp for uniqueness
  } else {
    // Fallback for no title
    return `post-${timestamp}`;
  }
};
