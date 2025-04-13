
import { useState, useEffect } from 'react';
import { toast } from "@/lib/utils/toast-utils";
import { validateImageFile } from '@/lib/utils/imageUpload';

/**
 * Hook to handle image selection and preview
 */
export function useImageSelection() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Handle image file selection
  const handleImageChange = (file: File | null) => {
    if (!file) return;
    
    // Validate the image file
    const validationError = validateImageFile(file);
    if (validationError) {
      toast({
        variant: "destructive",
        title: "خطأ في الصورة",
        description: validationError,
      });
      return;
    }
    
    setSelectedImage(file);
    
    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    console.log(`[useImageSelection] New image selected, preview URL: ${objectUrl}`);
    setPreviewUrl(objectUrl);
    
    // Store in session storage
    sessionStorage.setItem('blogImageUrl', objectUrl);
    sessionStorage.setItem('blogImageIsFile', 'true');
  };
  
  // Handle removing the selected image
  const handleRemoveImage = () => {
    console.log('[useImageSelection] Removing image from preview');
    setSelectedImage(null);
    
    if (previewUrl && !previewUrl.startsWith('http')) {
      URL.revokeObjectURL(previewUrl);
    }
    
    setPreviewUrl(null);
    
    // Remove from session storage
    sessionStorage.removeItem('blogImageUrl');
    sessionStorage.removeItem('blogImageIsFile');
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl && !previewUrl.startsWith('http')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return {
    selectedImage,
    previewUrl, 
    handleImageChange,
    handleRemoveImage,
    setPreviewUrl
  };
}
