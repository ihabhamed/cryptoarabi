
import { useState, useEffect } from 'react';
import { toast } from "@/lib/utils/toast-utils";
import { uploadImage } from '@/lib/utils/imageUpload';

export function useBlogImage() {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Add storage key for image persistence
  const getStorageKey = (id?: string) => {
    return id ? `blogImage_${id}` : 'blogImage_new';
  };

  // Store image data in sessionStorage to persist across tab switches
  const persistImageData = (imageUrl: string | null, isFile: boolean = false) => {
    if (imageUrl) {
      sessionStorage.setItem('blogImageUrl', imageUrl);
      sessionStorage.setItem('blogImageIsFile', isFile ? 'true' : 'false');
    } else {
      sessionStorage.removeItem('blogImageUrl');
      sessionStorage.removeItem('blogImageIsFile');
    }
  };

  const handleImageChange = (file: File | null) => {
    if (!file) return;
    
    setSelectedImage(file);
    
    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Persist in session storage
    persistImageData(objectUrl, true);
  };
  
  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (previewUrl && !previewUrl.startsWith('http')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    
    // Remove from session storage
    persistImageData(null);
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
      
      // Persist the permanent URL
      persistImageData(imageUrl);
      
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
      
      // Persist in session storage
      persistImageData(url);
    }
  };

  // Restore image from session storage when component mounts or tab is switched back
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const savedImageUrl = sessionStorage.getItem('blogImageUrl');
        const isFile = sessionStorage.getItem('blogImageIsFile') === 'true';
        
        if (savedImageUrl && !previewUrl) {
          // If it's a file URL (object URL), we can't restore the actual file,
          // but we can show the image and mark it for upload later
          if (isFile) {
            // For file URLs from previous sessions, we can't restore them directly
            // We'll just restore the external URL if it's available
            setPreviewUrl(savedImageUrl);
          } else {
            // For normal URLs (already uploaded), just restore
            setPreviewUrl(savedImageUrl);
          }
        }
      }
    };
    
    // Check on component mount
    handleVisibilityChange();
    
    // Also add visibility change listener
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [previewUrl]);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl && !previewUrl.startsWith('http')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
