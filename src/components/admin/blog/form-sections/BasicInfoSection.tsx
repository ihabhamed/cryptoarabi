
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BlogPost } from '@/types/supabase';

interface BasicInfoSectionProps {
  formData: Partial<BlogPost>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  generateSlug: () => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  handleChange,
  generateSlug,
}) => {
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
    </div>
  );
};

export default BasicInfoSection;
