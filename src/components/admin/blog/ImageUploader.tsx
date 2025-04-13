
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/lib/utils/toast-utils";
import { X, Upload, AlertTriangle } from "lucide-react";
import { validateImageFile } from '@/lib/utils/imageUpload';
import { isValidImageUrl, getFallbackImageUrl } from '@/hooks/blog/utils/blogImageUtils';

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
  const [internalImageUrl, setInternalImageUrl] = useState('');
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Debug when imageUrl or previewUrl changes
  useEffect(() => {
    console.log(`[ImageUploader] imageUrl prop: "${imageUrl || 'NULL'}", previewUrl: "${previewUrl || 'NULL'}"`);
    // Reset image error state on new URL
    setImageError(false);
    setImageLoaded(false);
  }, [imageUrl, previewUrl]);

  // Update internal state when external imageUrl changes
  useEffect(() => {
    console.log(`[ImageUploader] External imageUrl changed to: "${imageUrl || 'NULL'}"`);
    // Only update if the imageUrl is not null/undefined/empty
    if (imageUrl && imageUrl !== 'null' && imageUrl !== 'undefined' && imageUrl.trim() !== '') {
      setInternalImageUrl(imageUrl);
    } else {
      setInternalImageUrl('');
    }
  }, [imageUrl]);

  // Set image URL from input if no file is selected but URL is provided
  useEffect(() => {
    if (internalImageUrl && !previewUrl) {
      console.log(`[ImageUploader] Setting image URL from input: "${internalImageUrl}"`);
      
      if (isValidImageUrl(internalImageUrl)) {
        console.log('[ImageUploader] URL appears to be valid, applying change');
        onImageUrlChange(internalImageUrl);
        
        // Reset error state for new URL
        setImageError(false);
        setImageLoaded(false);
      } else {
        console.log('[ImageUploader] URL does not appear to be valid, ignoring');
      }
    }
  }, [internalImageUrl, previewUrl, onImageUrlChange]);
  
  // When tab visibility changes, ensure the image is still displayed
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && internalImageUrl && !previewUrl) {
        console.log('[ImageUploader] Tab visible again, checking image URL');
        if (isValidImageUrl(internalImageUrl)) {
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
    
    // Clear errors when new file is selected
    setImageError(false);
    setImageLoaded(false);
    
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
      
      // Reset error state for new URL
      setImageError(false);
      setImageLoaded(false);
    }
    
    // Store in sessionStorage to persist across tab changes
    if (url.trim()) {
      sessionStorage.setItem('lastImageUrl', url);
    } else {
      sessionStorage.removeItem('lastImageUrl');
    }
  };

  const handleImageLoad = () => {
    console.log('[ImageUploader] Image loaded successfully');
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    console.error(`[ImageUploader] Error loading preview image: ${previewUrl}`);
    setImageError(true);
    setImageLoaded(false);
    
    // Only show toast for errors after initial load attempt
    if (imageLoaded) {
      toast({
        variant: "destructive",
        title: "خطأ في تحميل الصورة",
        description: "تعذر تحميل الصورة. يرجى التحقق من صحة الرابط.",
      });
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
            className={`w-full h-auto rounded-md border ${imageError ? 'border-red-500' : 'border-white/20'} object-cover aspect-video`}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
          
          {imageError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-md">
              <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
              <p className="text-white text-sm text-center px-4">تعذر تحميل الصورة</p>
            </div>
          )}
          
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
