
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Tag, Search, PlusCircle, Sparkles } from 'lucide-react';
import { BlogPost } from '@/types/supabase';
import { useBlogPosts } from '@/lib/hooks/useBlogPosts';
import { toast } from '@/lib/utils/toast-utils';
import { generateHashtags } from '@/lib/utils/geminiApi';

interface TagsSectionProps {
  formData: Partial<BlogPost & { hashtags?: string }>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const TagsSection: React.FC<TagsSectionProps> = ({
  formData,
  handleChange,
}) => {
  const [hashtag, setHashtag] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [suggestedHashtags, setSuggestedHashtags] = useState<string[]>([]);
  const [isGeneratingHashtags, setIsGeneratingHashtags] = useState(false);
  const { data: blogPosts } = useBlogPosts();
  
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
    
    // Save to localStorage to ensure persistence
    const storageKey = formData.id ? `blogFormData_${formData.id}` : 'blogFormData_new';
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      localStorage.setItem(storageKey, JSON.stringify({
        ...parsedData,
        hashtags: newHashtags.join(', ')
      }));
    }
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
  
  // Generate hashtags automatically based on content
  const generateHashtagsAutomatically = async () => {
    if (!formData.title || !formData.content) {
      toast({
        title: "نقص في المعلومات",
        description: "يرجى إضافة عنوان ومحتوى للمنشور أولاً",
        variant: "destructive"
      });
      return;
    }
    
    setIsGeneratingHashtags(true);
    
    try {
      const generatedTags = await generateHashtags(
        formData.title,
        formData.content
      );
      
      if (generatedTags && generatedTags.length > 0) {
        // Filter out hashtags that are already added
        const newTags = generatedTags.filter(tag => !hashtags.includes(tag));
        
        if (newTags.length > 0) {
          setSuggestedHashtags([...suggestedHashtags, ...newTags]);
          
          toast({
            title: "تم التوليد بنجاح",
            description: `تم توليد ${newTags.length} هاشتاغ جديد. انقر عليها لإضافتها.`,
          });
        } else {
          toast({
            title: "لم يتم العثور على هاشتاغات جديدة",
            description: "جميع الهاشتاغات المقترحة موجودة بالفعل",
          });
        }
      } else {
        toast({
          title: "لم يتم العثور على هاشتاغات",
          description: "لم نتمكن من توليد هاشتاغات للمحتوى الحالي",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "خطأ في التوليد",
        description: "حدث خطأ أثناء توليد الهاشتاغات",
        variant: "destructive"
      });
      console.error("Error generating hashtags:", error);
    } finally {
      setIsGeneratingHashtags(false);
    }
  };
  
  // Generate hashtag suggestions based on title and content
  useEffect(() => {
    if (formData.title || formData.content) {
      // Combine existing hashtags from all posts
      const existingHashtags = new Set<string>();
      blogPosts?.forEach(post => {
        if (post.hashtags) {
          post.hashtags.split(',').forEach(tag => {
            existingHashtags.add(tag.trim());
          });
        }
      });
      
      // Filter out hashtags already added to this post
      const filteredSuggestions = Array.from(existingHashtags)
        .filter(tag => tag && !hashtags.includes(tag))
        .slice(0, 10);
        
      setSuggestedHashtags(filteredSuggestions);
    }
  }, [formData.title, formData.content, blogPosts, hashtags]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <label className="flex items-center text-white">
          <Tag className="mr-2 h-4 w-4" />
          الهاشتاغات
        </label>
        
        <Button 
          type="button"
          onClick={generateHashtagsAutomatically}
          className="bg-crypto-orange hover:bg-crypto-orange/80 text-white"
          disabled={isGeneratingHashtags}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {isGeneratingHashtags ? "جاري التوليد..." : "توليد هاشتاغات تلقائياً"}
        </Button>
      </div>
      
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
