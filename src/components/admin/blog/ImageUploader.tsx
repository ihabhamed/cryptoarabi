
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/lib/utils/toast-utils";
import { X, Upload } from "lucide-react";
import { validateImageFile } from '@/lib/utils/imageUpload';

interface ImageUploaderProps {
  previewUrl: string | null;
  onImageChange: (file: File | null) => void;
  onImageUrlChange: (url: string) => void;
  onRemoveImage: () => void;
  imageUrl: string;
  isUploading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  previewUrl,
  onImageChange,
  onImageUrlChange,
  onRemoveImage,
  imageUrl,
  isUploading
}) => {
  const [internalImageUrl, setInternalImageUrl] = useState(imageUrl);

  // Debug when imageUrl or previewUrl changes
  useEffect(() => {
    console.log(`[ImageUploader] imageUrl prop: "${imageUrl || 'NULL'}", previewUrl: "${previewUrl || 'NULL'}"`);
  }, [imageUrl, previewUrl]);

  // Update internal state when external imageUrl changes
  useEffect(() => {
    console.log(`[ImageUploader] External imageUrl changed to: "${imageUrl || 'NULL'}"`);
    setInternalImageUrl(imageUrl);
  }, [imageUrl]);

  // Set image URL from input if no file is selected but URL is provided
  useEffect(() => {
    if (internalImageUrl && !previewUrl) {
      console.log(`[ImageUploader] Setting image URL from input: "${internalImageUrl}"`);
      // Only set preview URL if it's a valid image URL and not already set
      if (internalImageUrl.match(/\.(jpeg|jpg|gif|png|webp)$/) !== null) {
        console.log('[ImageUploader] URL appears to be a valid image, applying change');
        onImageUrlChange(internalImageUrl);
      } else {
        console.log('[ImageUploader] URL does not appear to be an image, will validate by loading');
        // Try to validate the URL by creating an image
        const img = new Image();
        img.onload = () => {
          console.log('[ImageUploader] Image loaded successfully, applying URL');
          onImageUrlChange(internalImageUrl);
        };
        img.onerror = () => {
          console.log('[ImageUploader] Failed to load image, URL may not be valid');
        };
        img.src = internalImageUrl;
      }
    }
  }, [internalImageUrl, previewUrl, onImageUrlChange]);
  
  // When tab visibility changes, ensure the image is still displayed
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && internalImageUrl && !previewUrl) {
        console.log('[ImageUploader] Tab visible again, checking image URL');
        // Re-apply the image URL when tab becomes visible again
        if (internalImageUrl.match(/\.(jpeg|jpg|gif|png|webp)$/) !== null) {
          onImageUrlChange(internalImageUrl);
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [internalImageUrl, previewUrl, onImageUrlChange]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const error = validateImageFile(file);
    if (error) {
      toast({
        variant: "destructive",
        title: "خطأ في الصورة",
        description: error,
      });
      return;
    }
    
    console.log(`[ImageUploader] File selected: ${file.name}`);
    onImageChange(file);
    
    // Clear the input value so the same file can be selected again if needed
    e.target.value = '';
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setInternalImageUrl(url);
    
    // If URL is cleared, remove the image
    if (!url.trim()) {
      onRemoveImage();
      console.log('[ImageUploader] Image URL cleared');
    } else {
      console.log(`[ImageUploader] Image URL changed to: "${url}"`);
      
      // Don't apply the URL change immediately - wait for the useEffect to validate and apply it
      // This happens in the useEffect watching internalImageUrl
    }
    
    // Store in sessionStorage to persist across tab changes
    if (url.trim()) {
      sessionStorage.setItem('lastImageUrl', url);
    } else {
      sessionStorage.removeItem('lastImageUrl');
    }
  };

  return (
    <div>
      <label className="block text-white mb-2">صورة المنشور</label>
      
      {/* Image Preview */}
      {previewUrl && (
        <div className="relative mt-2 mb-4 w-full max-w-xs mx-auto">
          <img 
            src={previewUrl} 
            alt="معاينة الصورة" 
            className="w-full h-auto rounded-md border border-white/20 object-cover aspect-video"
            onError={() => {
              console.error(`[ImageUploader] Error loading preview image: ${previewUrl}`);
              toast({
                variant: "destructive",
                title: "خطأ في تحميل الصورة",
                description: "تعذر تحميل الصورة. يرجى التحقق من صحة الرابط.",
              });
            }}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={onRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <div className="flex flex-col gap-3">
        {/* File Upload */}
        <div className="relative">
          <label htmlFor="image-upload" className="cursor-pointer">
            <div className="flex items-center justify-center gap-2 p-4 bg-crypto-darkBlue/50 border-2 border-dashed border-white/20 rounded-md hover:bg-crypto-darkBlue/70 transition-colors">
              <Upload className="h-5 w-5 text-crypto-orange" />
              <span>اختر صورة للرفع أو اسحبها هنا</span>
            </div>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              disabled={isUploading}
            />
          </label>
        </div>
        
        {/* URL Input */}
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
      </div>
      <p className="text-xs text-gray-400 mt-1">يسمح بالصور بحجم أقصى 2 ميغابايت، بصيغة JPG، PNG، GIF أو WEBP.</p>
    </div>
  );
};

export default ImageUploader;
