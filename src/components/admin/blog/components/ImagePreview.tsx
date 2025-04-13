
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, X } from "lucide-react";
import { getFallbackImageUrl, normalizeImageUrl } from '@/hooks/blog/utils/blogImageUtils';

interface ImagePreviewProps {
  previewUrl: string | null;
  onRemoveImage: () => void;
  onRetryLoad: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  previewUrl,
  onRemoveImage,
  onRetryLoad
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Try to normalize the preview URL if it exists
  const normalizedPreviewUrl = previewUrl ? normalizeImageUrl(previewUrl) : null;
  const displayUrl = normalizedPreviewUrl || getFallbackImageUrl();
  
  // Reset error state when previewUrl changes
  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [previewUrl]);
  
  const handleImageLoad = () => {
    console.log('[ImagePreview] Image loaded successfully');
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    console.error(`[ImagePreview] Error loading preview image: ${previewUrl}`);
    setImageError(true);
    setImageLoaded(false);
  };

  return (
    <div className="relative mt-2 mb-4 w-full max-w-xs mx-auto">
      <img 
        src={displayUrl} 
        alt="معاينة الصورة" 
        className={`w-full h-auto rounded-md border ${imageError ? 'border-red-500' : 'border-white/20'} object-cover aspect-video`}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
      
      {imageError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-md">
          <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
          <p className="text-white text-sm text-center px-4 mb-2">تعذر تحميل الصورة</p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-2"
            onClick={onRetryLoad}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            إعادة المحاولة
          </Button>
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
  );
};

export default ImagePreview;
