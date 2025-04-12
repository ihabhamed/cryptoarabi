
import { useState } from 'react';
import { toast } from "@/lib/utils/toast-utils";
import { uploadImage } from '@/lib/utils/imageUpload';

export function useBlogImage() {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (file: File | null) => {
    if (!file) return;
    
    setSelectedImage(file);
    
    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };
  
  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (previewUrl && !previewUrl.startsWith('http')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };

  const uploadBlogImage = async (): Promise<string | null> => {
    if (!selectedImage) return null;
    
    try {
      setUploadingImage(true);
      const imageUrl = await uploadImage(selectedImage, 'blog');
      
      if (!imageUrl) {
        toast({
          variant: "destructive",
          title: "خطأ في رفع الصورة",
          description: "حدث خطأ أثناء رفع الصورة، يرجى المحاولة مرة أخرى",
        });
        return null;
      }
      
      return imageUrl;
    } catch (error) {
      console.error("Error uploading blog image:", error);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const setInitialImagePreview = (url: string | null) => {
    if (url) {
      setPreviewUrl(url);
    }
  };

  return {
    uploadingImage,
    selectedImage, 
    previewUrl,
    handleImageChange,
    handleRemoveImage,
    uploadBlogImage,
    setInitialImagePreview
  };
}
