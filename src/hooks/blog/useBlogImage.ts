
import { useState, useEffect } from 'react';
import { toast } from "@/lib/utils/toast-utils";
import { uploadImage } from '@/lib/utils/imageUpload';

export function useBlogImage() {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Store image data in sessionStorage to persist across tab switches
  const persistImageData = (imageUrl: string | null, isFile: boolean = false) => {
    if (imageUrl) {
      sessionStorage.setItem('blogImageUrl', imageUrl);
      sessionStorage.setItem('blogImageIsFile', isFile ? 'true' : 'false');
      // Log the image URL being saved to sessionStorage
      console.log(`Persisting image to sessionStorage: ${imageUrl}`);
    } else {
      sessionStorage.removeItem('blogImageUrl');
      sessionStorage.removeItem('blogImageIsFile');
      console.log('Clearing image from sessionStorage');
    }
  };

  const handleImageChange = (file: File | null) => {
    if (!file) return;
    
    setSelectedImage(file);
    
    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    console.log(`New image selected, preview URL: ${objectUrl}`);
    
    // Persist in session storage
    persistImageData(objectUrl, true);
  };
  
  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (previewUrl && !previewUrl.startsWith('http')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    console.log('Image removed from preview');
    
    // Remove from session storage
    persistImageData(null);
  };

  const uploadBlogImage = async (): Promise<string | null> => {
    if (!selectedImage) return null;
    
    try {
      setUploadingImage(true);
      console.log(`Uploading image: ${selectedImage.name}`);
      const imageUrl = await uploadImage(selectedImage, 'blog');
      
      if (!imageUrl) {
        toast({
          variant: "destructive",
          title: "خطأ في رفع الصورة",
          description: "حدث خطأ أثناء رفع الصورة، يرجى المحاولة مرة أخرى",
        });
        return null;
      }
      
      console.log(`Image uploaded successfully: ${imageUrl}`);
      
      // Remove any query parameters from the URL to prevent caching issues
      const cleanImageUrl = imageUrl.includes('?') ? imageUrl.split('?')[0] : imageUrl;
      
      // Persist the permanent URL
      persistImageData(cleanImageUrl);
      
      return cleanImageUrl;
    } catch (error) {
      console.error("Error uploading blog image:", error);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const setInitialImagePreview = (url: string | null) => {
    if (url && url !== 'null' && url !== 'undefined' && url.trim() !== '') {
      console.log(`Setting initial image preview: ${url}`);
      
      // Remove any query parameters to prevent caching issues
      const cleanUrl = url.includes('?') ? url.split('?')[0] : url;
      
      setPreviewUrl(cleanUrl);
      
      // Persist in session storage
      persistImageData(cleanUrl);
    } else {
      console.log(`Invalid URL provided to setInitialImagePreview: ${url}`);
    }
  };

  // Restore image from session storage when component mounts or tab is switched back
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const savedImageUrl = sessionStorage.getItem('blogImageUrl');
        const isFile = sessionStorage.getItem('blogImageIsFile') === 'true';
        
        if (savedImageUrl && !previewUrl) {
          console.log(`Restoring image from sessionStorage: ${savedImageUrl}`);
          
          // For both file URLs and normal URLs, restore the preview
          setPreviewUrl(savedImageUrl);
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
