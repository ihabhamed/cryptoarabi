import React, { useState } from 'react';
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
    
    onImageChange(file);
    
    // Clear the input value so the same file can be selected again if needed
    e.target.value = '';
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
            value={imageUrl}
            onChange={(e) => onImageUrlChange(e.target.value)}
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
