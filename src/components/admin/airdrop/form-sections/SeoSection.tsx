
import React from 'react';
import { NewAirdrop } from '@/types/supabase';
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";

interface SeoSectionProps {
  formData: NewAirdrop & { meta_title?: string; meta_description?: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isGeneratingMeta?: boolean;
  generateMetaContent?: () => void;
}

const SeoSection: React.FC<SeoSectionProps> = ({ 
  formData, 
  handleChange,
  isGeneratingMeta,
  generateMetaContent
}) => {
  return (
    <div className="space-y-4 border border-white/10 rounded-md p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">بيانات SEO</h3>
        {generateMetaContent && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-crypto-orange text-crypto-orange hover:bg-crypto-orange/10"
            onClick={generateMetaContent}
            disabled={isGeneratingMeta}
          >
            <Wand2 className="h-4 w-4 mr-2" />
            {isGeneratingMeta ? "جاري التوليد..." : "توليد تلقائي"}
          </Button>
        )}
      </div>
      
      <div>
        <label htmlFor="meta_title" className="block text-sm font-medium text-gray-300 mb-1">
          عنوان الميتا
        </label>
        <input
          type="text"
          id="meta_title"
          name="meta_title"
          className="w-full bg-crypto-darkBlue/50 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-crypto-orange"
          value={formData.meta_title || ''}
          onChange={handleChange}
          placeholder="أدخل عنوان الميتا"
        />
        <p className="text-xs text-gray-400 mt-1">
          يظهر في نتائج البحث (60-70 حرف مثالي)
        </p>
      </div>
      
      <div>
        <label htmlFor="meta_description" className="block text-sm font-medium text-gray-300 mb-1">
          وصف الميتا
        </label>
        <textarea
          id="meta_description"
          name="meta_description"
          rows={3}
          className="w-full bg-crypto-darkBlue/50 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-crypto-orange resize-none"
          value={formData.meta_description || ''}
          onChange={handleChange}
          placeholder="أدخل وصف الميتا"
        />
        <p className="text-xs text-gray-400 mt-1">
          يظهر في نتائج البحث (حوالي 155-160 حرف مثالي)
        </p>
      </div>
    </div>
  );
};

export default SeoSection;
