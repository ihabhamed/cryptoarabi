
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Tag, Search, PlusCircle } from 'lucide-react';
import { useBlogPosts } from '@/lib/hooks/useBlogPosts';
import { BlogPost } from '@/types/supabase';

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
  
  // Generate meta tags if empty when title/content changes
  useEffect(() => {
    if (formData.title && !formData.meta_title) {
      const event = {
        target: {
          name: 'meta_title',
          value: formData.title
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleChange(event);
    }
    
    if (formData.excerpt && !formData.meta_description) {
      const event = {
        target: {
          name: 'meta_description',
          value: formData.excerpt
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleChange(event);
    }
  }, [formData.title, formData.excerpt]);
  
  return (
    <Tabs defaultValue="content" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="content">المحتوى</TabsTrigger>
        <TabsTrigger value="seo">تحسين محركات البحث</TabsTrigger>
      </TabsList>
      
      <TabsContent value="content" className="space-y-4">
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
      </TabsContent>
      
      <TabsContent value="seo" className="space-y-4">
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
        
        <div>
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
      </TabsContent>
    </Tabs>
  );
};

export default BlogFormFields;
