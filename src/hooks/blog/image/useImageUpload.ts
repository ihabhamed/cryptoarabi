
import { useState } from 'react';
import { toast } from "@/lib/utils/toast-utils";
import { uploadImage } from '@/lib/utils/imageUpload';

/**
 * Hook to handle image uploading functionality
 */
export function useImageUpload() {
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Upload an image file to storage
  const uploadBlogImage = async (imageFile: File | null): Promise<string | null> => {
    if (!imageFile) return null;
    
    try {
      setUploadingImage(true);
      console.log(`[useImageUpload] Uploading image: ${imageFile.name}`);
      const imageUrl = await uploadImage(imageFile, 'blog');
      
      if (!imageUrl) {
        toast({
          variant: "destructive",
          title: "خطأ في رفع الصورة",
          description: "حدث خطأ أثناء رفع الصورة، يرجى المحاولة مرة أخرى",
        });
        return null;
      }
      
      console.log(`[useImageUpload] Image uploaded successfully: ${imageUrl}`);
      
      // Remove any query parameters from the URL to prevent caching issues
      const cleanImageUrl = imageUrl.includes('?') ? imageUrl.split('?')[0] : imageUrl;
      return cleanImageUrl;
    } catch (error) {
      console.error("[useImageUpload] Error uploading blog image:", error);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  return {
    uploadingImage,
    uploadBlogImage
  };
}
