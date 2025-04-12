
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LinkIcon } from "lucide-react";

interface ButtonSettingsProps {
  buttonText: string;
  buttonUrl: string;
  onTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * ButtonSettings Component
 * Manages button text and URL configuration
 */
const ButtonSettings: React.FC<ButtonSettingsProps> = ({ 
  buttonText, 
  buttonUrl, 
  onTextChange, 
  onUrlChange 
}) => {
  // Helper function to check if URL is external
  const isExternalUrl = (url: string): boolean => {
    return url?.match(/^https?:\/\//) !== null;
  };

  return (
    <div className="space-y-4 border border-white/10 rounded-md p-4 bg-crypto-darkBlue/20">
      <div className="flex items-center gap-2 mb-2">
        <LinkIcon className="h-5 w-5 text-crypto-orange" />
        <h3 className="text-lg font-medium text-white">إعدادات زر القسم</h3>
      </div>
      
      {/* Button text field */}
      <div className="space-y-2">
        <Label htmlFor="about_button_text" className="text-white">نص زر من نحن</Label>
        <Input 
          id="about_button_text" 
          name="about_button_text"
          value={buttonText || ''} 
          onChange={onTextChange}
          placeholder="اعرف المزيد عنا" 
          className="bg-crypto-darkBlue/30 border-white/10 text-white"
        />
      </div>
      
      {/* Button URL field */}
      <div className="space-y-2">
        <Label htmlFor="about_button_url" className="text-white">رابط زر من نحن</Label>
        <Input 
          id="about_button_url" 
          name="about_button_url"
          value={buttonUrl || ''} 
          onChange={onUrlChange}
          placeholder="/about" 
          className="bg-crypto-darkBlue/30 border-white/10 text-white"
        />
        <p className="text-sm text-gray-400">
          {isExternalUrl(buttonUrl || '') 
            ? 'سيتم فتح هذا الرابط في نافذة جديدة (رابط خارجي)' 
            : 'سيتم توجيه المستخدم داخل الموقع (رابط داخلي)'}
        </p>
      </div>
    </div>
  );
};

export default ButtonSettings;
