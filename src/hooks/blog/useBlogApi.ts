
import { useBlogFetch } from './useBlogFetch';
import { useBlogSave } from './useBlogSave';

interface UseBlogApiProps {
  id?: string;
  onSuccess?: () => void;
}

/**
 * Main hook for blog API operations, combining fetch and save functionality
 */
export function useBlogApi({ id, onSuccess }: UseBlogApiProps = {}) {
  const isEditMode = !!id;
  const { fetchBlogPost, inspectImageUrls } = useBlogFetch();
  const { saveBlogPost } = useBlogSave();

  // Save a blog post with callback handling
  const handleSaveBlogPost = async (blogData: any): Promise<boolean> => {
    const success = await saveBlogPost(blogData, id);
    
    if (success && onSuccess) {
      onSuccess();
    }
    
    return success;
  };

  return {
    fetchBlogPost,
    saveBlogPost: handleSaveBlogPost,
    inspectImageUrls
  };
}
