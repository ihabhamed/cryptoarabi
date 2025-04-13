
import { BlogPost } from '@/types/supabase';

interface UseSlugGeneratorProps {
  formData: Partial<BlogPost>;
  setFormData: (data: Partial<BlogPost> | ((prev: Partial<BlogPost>) => Partial<BlogPost>)) => void;
}

/**
 * Hook to generate and manage slugs for blog posts
 */
export function useSlugGenerator({ formData, setFormData }: UseSlugGeneratorProps) {
  // Generate slug from title - used as a fallback to the more robust method in BasicInfoSection
  const generateSlug = () => {
    if (formData.title) {
      // Generate a timestamp-based component for uniqueness
      const timestamp = new Date().getTime().toString().slice(-6);
      let slug = '';
      
      // Check if title contains Arabic characters
      if (/[\u0600-\u06FF]/.test(formData.title)) {
        // For Arabic text, use a generic post slug with timestamp
        slug = `post-${timestamp}`;
      } else {
        // For Latin text, use the standard slug generator with timestamp appended
        slug = formData.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')  // Remove special characters except hyphens
          .replace(/\s+/g, '-')      // Replace spaces with hyphens
          .replace(/-+/g, '-')       // Replace multiple hyphens with a single one
          .replace(/^-+|-+$/g, '')   // Remove hyphens from start and end
          .concat(`-${timestamp}`);  // Add timestamp for uniqueness
      }
      
      console.log("Generated slug in form state:", slug);
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  return { generateSlug };
}
