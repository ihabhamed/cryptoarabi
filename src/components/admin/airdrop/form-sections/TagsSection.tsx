
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Tag, Search, PlusCircle } from 'lucide-react';
import { NewAirdrop } from '@/types/supabase';
import { useAirdrops } from "@/lib/hooks";

interface TagsSectionProps {
  formData: NewAirdrop & { hashtags?: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const TagsSection: React.FC<TagsSectionProps> = ({
  formData,
  handleChange,
}) => {
  const [hashtag, setHashtag] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [suggestedHashtags, setSuggestedHashtags] = useState<string[]>([]);
  const { data: airdrops } = useAirdrops();
  
  // Initialize hashtags from formData
  useEffect(() => {
    if (formData.hashtags) {
      setHashtags(formData.hashtags.split(',').map(tag => tag.trim()).filter(Boolean));
    }
  }, [formData.hashtags]);
  
  // Update parent component's formData when hashtags change
  const updateHashtags = (newHashtags: string[]) => {
    const event = {
      target: {
        name: 'hashtags',
        value: newHashtags.join(', ')
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleChange(event);
    setHashtags(newHashtags);
  };
  
  // Add a hashtag
  const addHashtag = () => {
    if (hashtag && !hashtags.includes(hashtag)) {
      const newHashtags = [...hashtags, hashtag];
      updateHashtags(newHashtags);
      setHashtag('');
    }
  };
  
  // Remove a hashtag
  const removeHashtag = (tagToRemove: string) => {
    const newHashtags = hashtags.filter(tag => tag !== tagToRemove);
    updateHashtags(newHashtags);
  };
  
  // Add a suggested hashtag
  const addSuggestedHashtag = (tag: string) => {
    if (!hashtags.includes(tag)) {
      const newHashtags = [...hashtags, tag];
      updateHashtags(newHashtags);
      
      // Remove from suggestions
      setSuggestedHashtags(prev => prev.filter(t => t !== tag));
    }
  };
  
  // Generate hashtag suggestions based on title and description
  useEffect(() => {
    if (formData.title || formData.description) {
      // Combine existing hashtags from all airdrops
      const existingHashtags = new Set<string>();
      airdrops?.forEach(airdrop => {
        if (airdrop.hashtags) {
          airdrop.hashtags.split(',').forEach(tag => {
            existingHashtags.add(tag.trim());
          });
        }
      });
      
      // Filter out hashtags already added to this airdrop
      const filteredSuggestions = Array.from(existingHashtags)
        .filter(tag => tag && !hashtags.includes(tag))
        .slice(0, 10);
        
      setSuggestedHashtags(filteredSuggestions);
    }
  }, [formData.title, formData.description, airdrops, hashtags]);

  return (
    <div className="border-t border-white/10 pt-6">
      <label className="flex items-center text-white mb-2">
        <Tag className="mr-2 h-4 w-4" />
        الهاشتاغات
      </label>
      
      <div className="flex gap-2 mb-2">
        <Input
          value={hashtag}
          onChange={(e) => setHashtag(e.target.value)}
          placeholder="أضف هاشتاغ"
          className="bg-crypto-darkBlue/50 border-white/20 text-white"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addHashtag();
            }
          }}
        />
        <Button 
          type="button"
          onClick={addHashtag}
          className="bg-crypto-orange hover:bg-crypto-orange/80"
        >
          إضافة
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {hashtags.map((tag, index) => (
          <Badge 
            key={index} 
            className="bg-crypto-darkBlue hover:bg-crypto-darkBlue/80 text-white flex items-center gap-1"
          >
            {tag}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 text-white hover:text-white hover:bg-transparent"
              onClick={() => removeHashtag(tag)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        {hashtags.length === 0 && (
          <p className="text-sm text-gray-400">لم يتم إضافة هاشتاغات بعد</p>
        )}
      </div>
      
      {suggestedHashtags.length > 0 && (
        <div>
          <p className="text-sm text-white mb-2 flex items-center">
            <Search className="mr-2 h-4 w-4 text-crypto-orange" />
            هاشتاغات مقترحة:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedHashtags.map((tag, index) => (
              <Badge 
                key={index} 
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
      
      <input 
        type="hidden" 
        name="hashtags" 
        value={hashtags.join(', ')}
      />
    </div>
  );
};

export default TagsSection;
