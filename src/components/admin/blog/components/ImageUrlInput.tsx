
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { isValidImageUrl, shouldClearImageUrl } from '@/hooks/blog/utils/blogImageUtils';

interface ImageUrlInputProps {
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
  onRemoveImage: () => void;
  isUploading: boolean;
}

const ImageUrlInput: React.FC<ImageUrlInputProps> = ({
  imageUrl,
  onImageUrlChange,
  onRemoveImage,
  isUploading
}) => {
  const [internalImageUrl, setInternalImageUrl] = useState('');
  
  // Update internal state when external imageUrl changes
  useEffect(() => {
    console.log(`[ImageUrlInput] External imageUrl changed to: "${imageUrl || 'NULL'}"`);
    // Only update if the imageUrl is not null/undefined/empty
    if (!shouldClearImageUrl(imageUrl)) {
      setInternalImageUrl(imageUrl);
    } else {
      setInternalImageUrl('');
    }
  }, [imageUrl]);
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setInternalImageUrl(url);
    
    // If URL is cleared, remove the image
    if (!url.trim()) {
      onRemoveImage();
      console.log('[ImageUrlInput] Image URL cleared');
    } else {
      console.log(`[ImageUrlInput] Image URL changed to: "${url}"`);
      
      // Only update the parent component if URL is valid
      if (isValidImageUrl(url)) {
        onImageUrlChange(url);
      }
    }
    
    // Store in sessionStorage to persist across tab changes
    if (url.trim()) {
      sessionStorage.setItem('lastImageUrl', url);
    } else {
      sessionStorage.removeItem('lastImageUrl');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-white text-sm">أو</span>
      <Input
        name="image_url"
        value={internalImageUrl}
        onChange={handleUrlChange}
        placeholder="أدخل رابط صورة المنشور"
        className="bg-crypto-darkBlue/50 border-white/20 text-white"
        disabled={isUploading}
      />
    </div>
  );
};

export default ImageUrlInput;
