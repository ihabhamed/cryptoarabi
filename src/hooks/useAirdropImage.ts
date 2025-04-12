
import { useState } from 'react';
import { uploadImage } from '@/lib/utils/imageUpload';
import { useToast } from "@/hooks/use-toast";
import { NewAirdrop } from '@/types/supabase';

interface UseAirdropImageProps {
  initialImageUrl?: string | null;
}

export function useAirdropImage({ initialImageUrl }: UseAirdropImageProps = {}) {
  const { toast } = useToast();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl || null);
  
  const handleImageChange = (file: File | null) => {
    if (!file) return;
    
    setSelectedImage(file);
    
    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };
  
  const handleImageUrlChange = (url: string, formSetter: (updater: (prev: NewAirdrop) => NewAirdrop) => void) => {
    formSetter(prev => ({ ...prev, image_url: url }));
    
    // If we have a direct URL, show it as preview and clear any file selection
    if (url) {
      setSelectedImage(null);
      setPreviewUrl(url);
    } else if (!selectedImage) {
      setPreviewUrl(null);
    }
  };
  
  const handleRemoveImage = (formSetter: (updater: (prev: NewAirdrop) => NewAirdrop) => void) => {
    setSelectedImage(null);
    if (previewUrl && !previewUrl.startsWith('http')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    formSetter(prev => ({ ...prev, image_url: '' }));
  };
  
  const uploadSelectedImage = async (): Promise<string | null> => {
    if (!selectedImage) return null;
    
    try {
      setUploadingImage(true);
      const imageUrl = await uploadImage(selectedImage, 'airdrops');
      
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
      toast({
        variant: "destructive",
        title: "خطأ في رفع الصورة",
        description: "حدث خطأ أثناء رفع الصورة، يرجى المحاولة مرة أخرى",
      });
      return null;
    } finally {
      setUploadingImage(false);
    }
  };
  
  return {
    uploadingImage,
    previewUrl,
    handleImageChange,
    handleImageUrlChange,
    handleRemoveImage,
    uploadSelectedImage
  };
}
