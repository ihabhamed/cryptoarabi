
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles } from 'lucide-react';
import { BlogPost } from '@/types/supabase';
import { generateMetaTags } from '@/lib/utils/geminiApi';
import { toast } from '@/lib/utils/toast-utils';

interface SeoSectionProps {
  formData: Partial<BlogPost & { meta_title?: string; meta_description?: string }>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const SeoSection: React.FC<SeoSectionProps> = ({
  formData,
  handleChange,
}) => {
  const [isGeneratingMeta, setIsGeneratingMeta] = React.useState(false);

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
      
      // Save to localStorage to ensure persistence
      const storageKey = formData.id ? `blogFormData_${formData.id}` : 'blogFormData_new';
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        localStorage.setItem(storageKey, JSON.stringify({
          ...parsedData,
          meta_title: metaTitle,
          meta_description: metaDescription
        }));
      }
      
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
    <div>
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
            placeholder="سيتم توليده تلقائياً عند الحفظ إذا تُرك فارغاً"
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
            placeholder="سيتم توليده تلقائياً عند الحفظ إذا تُرك فارغاً"
            className="bg-crypto-darkBlue/50 border-white/20 text-white min-h-[80px]"
          />
          <p className="text-xs text-gray-400 mt-1">
            وصف يظهر في نتائج محركات البحث (150-160 حرف)
          </p>
        </div>
      </div>
    </div>
  );
};

export default SeoSection;
