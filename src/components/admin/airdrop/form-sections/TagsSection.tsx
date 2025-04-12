
import React from 'react';
import { NewAirdrop } from '@/types/supabase';
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";

interface TagsSectionProps {
  formData: NewAirdrop & { hashtags?: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isGeneratingHashtags?: boolean;
  generateHashtagsContent?: () => void;
}

const TagsSection: React.FC<TagsSectionProps> = ({ 
  formData, 
  handleChange,
  isGeneratingHashtags,
  generateHashtagsContent
}) => {
  return (
    <div className="space-y-4 border border-white/10 rounded-md p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">الهاشتاغات</h3>
        {generateHashtagsContent && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-crypto-orange text-crypto-orange hover:bg-crypto-orange/10"
            onClick={generateHashtagsContent}
            disabled={isGeneratingHashtags}
          >
            <Wand2 className="h-4 w-4 mr-2" />
            {isGeneratingHashtags ? "جاري التوليد..." : "توليد تلقائي"}
          </Button>
        )}
      </div>
      
      <div>
        <label htmlFor="hashtags" className="block text-sm font-medium text-gray-300 mb-1">
          الهاشتاغات
        </label>
        <textarea
          id="hashtags"
          name="hashtags"
          rows={2}
          className="w-full bg-crypto-darkBlue/50 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-crypto-orange resize-none"
          value={formData.hashtags || ''}
          onChange={handleChange}
          placeholder="أدخل الهاشتاغات مفصولة بمسافات"
        />
        <p className="text-xs text-gray-400 mt-1">
          أدخل الهاشتاغات مفصولة بمسافات (مثال: #عملات_مشفرة #بيتكوين)
        </p>
      </div>
    </div>
  );
};

export default TagsSection;
