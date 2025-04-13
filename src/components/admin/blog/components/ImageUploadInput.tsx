
import React from 'react';
import { Upload } from "lucide-react";
import { validateImageFile } from '@/lib/utils/imageUpload';
import { toast } from "@/lib/utils/toast-utils";

interface ImageUploadInputProps {
  onImageChange: (file: File | null) => void;
  isUploading: boolean;
}

const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  onImageChange,
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
    
    console.log(`[ImageUploadInput] File selected: ${file.name}, size: ${(file.size / 1024).toFixed(2)}KB`);
    onImageChange(file);
    
    // Clear the input value so the same file can be selected again if needed
    e.target.value = '';
  };

  return (
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
  );
};

export default ImageUploadInput;
