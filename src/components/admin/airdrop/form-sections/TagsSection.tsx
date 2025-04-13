
import React, { useState, useEffect } from 'react';
import { NewAirdrop } from '@/types/airdrop';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Wand2, Tag, X, PlusCircle } from "lucide-react";
import { toast } from "@/lib/utils/toast-utils";
import { useAirdropHashtags } from '@/hooks/airdrop/useAirdropHashtags';

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
  const [hashtag, setHashtag] = useState('');
  const [renderKey, setRenderKey] = useState(0); // Force re-render when needed
  
  const { 
    hashtags, 
    suggestedHashtags, 
    addHashtag, 
    removeHashtag, 
    addSuggestedHashtag 
  } = useAirdropHashtags(formData, handleChange);

  // Add a hashtag from the input field
  const handleAddHashtag = () => {
    if (hashtag.trim()) {
      addHashtag(hashtag.trim());
      setHashtag('');
    }
  };

  // Handle enter key on input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddHashtag();
    }
  };

  // Force re-render when hashtags change
  useEffect(() => {
    setRenderKey(prev => prev + 1);
  }, [formData.hashtags]);

  // Handle removal of a hashtag with proper event prevention
  const handleRemoveHashtag = (e: React.MouseEvent, tag: string) => {
    e.preventDefault();
    e.stopPropagation();
    removeHashtag(tag);
  };

  return (
    <div className="space-y-4 border border-white/10 rounded-md p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white flex items-center">
          <Tag className="h-5 w-5 mr-2 text-crypto-orange" />
          الهاشتاغات
        </h3>
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
      
      {/* Hashtag Input */}
      <div className="flex gap-2">
        <Input
          value={hashtag}
          onChange={(e) => setHashtag(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="أدخل هاشتاغ جديد"
          className="bg-crypto-darkBlue/50 border-white/10 text-white"
        />
        <Button 
          type="button" 
          onClick={handleAddHashtag}
          className="bg-crypto-orange hover:bg-crypto-orange/80 text-white"
        >
          إضافة
        </Button>
      </div>
      
      {/* Current Hashtags */}
      <div className="flex flex-wrap gap-2 mt-2" key={renderKey}>
        {hashtags.length > 0 ? (
          hashtags.map((tag, index) => (
            <Badge 
              key={`${tag}-${index}`}
              className="bg-crypto-darkBlue hover:bg-crypto-darkBlue/80 text-white flex items-center gap-1"
            >
              {tag}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 text-white hover:text-white hover:bg-transparent"
                onClick={(e) => handleRemoveHashtag(e, tag)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))
        ) : (
          <p className="text-sm text-gray-400">لم يتم إضافة هاشتاغات بعد</p>
        )}
      </div>
      
      {/* Suggested Hashtags */}
      {suggestedHashtags.length > 0 && (
        <div className="mt-2">
          <p className="text-sm text-white mb-2">اقتراحات:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedHashtags.map((tag, index) => (
              <Badge 
                key={`suggestion-${tag}-${index}`}
                className="bg-crypto-darkGray hover:bg-crypto-darkGray/80 text-gray-300 flex items-center gap-1 cursor-pointer"
                onClick={() => addSuggestedHashtag(tag)}
              >
                {tag}
                <PlusCircle className="h-3 w-3 text-crypto-orange" />
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagsSection;
