
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Tag, Search, PlusCircle, Sparkles } from 'lucide-react';
import { useBlogPosts } from '@/lib/hooks/useBlogPosts';
import { BlogPost } from '@/types/supabase';
import { generateMetaTags } from '@/lib/utils/geminiApi';
import { toast } from '@/lib/utils/toast-utils';

interface BlogFormFieldsProps {
  formData: Partial<BlogPost & { meta_title?: string; meta_description?: string; hashtags?: string }>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  generateSlug: () => void;
}

const BlogFormFields: React.FC<BlogFormFieldsProps> = ({
  formData,
  handleChange,
  generateSlug,
}) => {
  const [hashtag, setHashtag] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [suggestedHashtags, setSuggestedHashtags] = useState<string[]>([]);
  const [isGeneratingMeta, setIsGeneratingMeta] = useState(false);
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

  // Function to generate meta tags using Gemini API
  const generateMetaTagsWithAI = async () => {
    if (!formData.title || !formData.content) {
      toast({
        title: "نقص في المعلومات",
        description: "يرجى إضافة عنوان ومحتوى للمنشور أولاً",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingMeta(true);
    
    try {
      const { metaTitle, metaDescription } = await generateMetaTags(
        formData.title,
        formData.content
      );
      
      // Update form data with generated meta tags
      const titleEvent = {
        target: {
          name: 'meta_title',
          value: metaTitle
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      const descEvent = {
        target: {
          name: 'meta_description',
          value: metaDescription
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleChange(titleEvent);
      handleChange(descEvent);
      
      toast({
        title: "تم التوليد بنجاح",
        description: "تم توليد العنوان والوصف بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ في التوليد",
        description: "حدث خطأ أثناء توليد العنوان والوصف",
        variant: "destructive"
      });
      console.error("Error generating meta tags:", error);
    } finally {
      setIsGeneratingMeta(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-white mb-2">العنوان</label>
        <Input
          name="title"
          value={formData.title || ''}
          onChange={handleChange}
          placeholder="أدخل عنوان المنشور"
          className="bg-crypto-darkBlue/50 border-white/20 text-white"
          required
        />
      </div>
      
      <div>
        <label className="block text-white mb-2">الملخص</label>
        <Textarea
          name="excerpt"
          value={formData.excerpt || ''}
          onChange={handleChange}
          placeholder="أدخل ملخص المنشور"
          className="bg-crypto-darkBlue/50 border-white/20 text-white min-h-[80px]"
        />
      </div>
      
      <div>
        <label className="block text-white mb-2">المحتوى</label>
        <Textarea
          name="content"
          value={formData.content || ''}
          onChange={handleChange}
          placeholder="أدخل محتوى المنشور"
          className="bg-crypto-darkBlue/50 border-white/20 text-white min-h-[200px]"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white mb-2">الكاتب</label>
          <Input
            name="author"
            value={formData.author || ''}
            onChange={handleChange}
            placeholder="أدخل اسم الكاتب"
            className="bg-crypto-darkBlue/50 border-white/20 text-white"
          />
        </div>
        
        <div>
          <label className="block text-white mb-2">التصنيف</label>
          <Input
            name="category"
            value={formData.category || ''}
            onChange={handleChange}
            placeholder="أدخل تصنيف المنشور"
            className="bg-crypto-darkBlue/50 border-white/20 text-white"
          />
        </div>
      </div>
      
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-white mb-2">الرابط الثابت</label>
          <Input
            name="slug"
            value={formData.slug || ''}
            onChange={handleChange}
            placeholder="الرابط-الثابت-للمنشور"
            className="bg-crypto-darkBlue/50 border-white/20 text-white"
          />
        </div>
        <Button 
          type="button"
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
          onClick={generateSlug}
        >
          توليد
        </Button>
      </div>
      
      <div>
        <label className="block text-white mb-2">تاريخ النشر</label>
        <Input
          type="datetime-local"
          name="publish_date"
          value={formData.publish_date ? new Date(formData.publish_date).toISOString().slice(0, 16) : ''}
          onChange={handleChange}
          className="bg-crypto-darkBlue/50 border-white/20 text-white"
        />
      </div>

      {/* SEO Section */}
      <div className="border-t border-white/10 pt-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">تحسين محركات البحث (SEO)</h3>
          <Button
            type="button"
            onClick={generateMetaTagsWithAI}
            className="bg-crypto-orange hover:bg-crypto-orange/80 text-white"
            disabled={isGeneratingMeta}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {isGeneratingMeta ? "جاري التوليد..." : "توليد تلقائي"}
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-white mb-2">عنوان ميتا (Meta Title)</label>
            <Input
              name="meta_title"
              value={formData.meta_title || ''}
              onChange={handleChange}
              placeholder="عنوان للمتصفح وصفحات البحث"
              className="bg-crypto-darkBlue/50 border-white/20 text-white"
            />
            <p className="text-xs text-gray-400 mt-1">
              يظهر في علامة تبويب المتصفح وفي نتائج البحث (60-70 حرف)
            </p>
          </div>
          
          <div>
            <label className="block text-white mb-2">وصف ميتا (Meta Description)</label>
            <Textarea
              name="meta_description"
              value={formData.meta_description || ''}
              onChange={handleChange}
              placeholder="وصف مختصر للمحتوى"
              className="bg-crypto-darkBlue/50 border-white/20 text-white min-h-[80px]"
            />
            <p className="text-xs text-gray-400 mt-1">
              وصف يظهر في نتائج محركات البحث (150-160 حرف)
            </p>
          </div>
        </div>
      </div>

      {/* Tags Section */}
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
    </div>
  );
};

export default BlogFormFields;
