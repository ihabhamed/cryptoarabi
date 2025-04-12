
import { useState } from 'react';
import { generateMetaTags, generateHashtags } from '@/lib/utils/geminiApi';
import { toast } from "@/lib/utils/toast-utils";

interface UseAirdropMetaGenerationProps {
  formData: {
    title: string;
    description: string;
    meta_title?: string;
    meta_description?: string;
    hashtags?: string;
  };
  setFormData: (updater: (prev: any) => any) => void;
}

export function useAirdropMetaGeneration({ formData, setFormData }: UseAirdropMetaGenerationProps) {
  const [isGeneratingMeta, setIsGeneratingMeta] = useState(false);
  const [isGeneratingHashtags, setIsGeneratingHashtags] = useState(false);

  const generateMetaContent = async () => {
    if (!formData.title || !formData.description) {
      toast({
        variant: "destructive",
        title: "بيانات غير كافية",
        description: "يرجى إضافة العنوان والوصف أولاً",
      });
      return;
    }

    try {
      setIsGeneratingMeta(true);
      const metaData = await generateMetaTags(formData.title, formData.description);
      
      if (metaData && metaData.metaTitle && metaData.metaDescription) {
        setFormData(prev => ({
          ...prev,
          meta_title: metaData.metaTitle,
          meta_description: metaData.metaDescription
        }));
        
        toast({
          title: "تم التوليد بنجاح",
          description: "تم توليد عنوان ووصف الميتا بنجاح",
        });
      } else {
        throw new Error("فشل في توليد بيانات الميتا");
      }
    } catch (error) {
      console.error("Error generating meta content:", error);
      toast({
        variant: "destructive",
        title: "خطأ في التوليد",
        description: "حدث خطأ أثناء توليد بيانات الميتا",
      });
    } finally {
      setIsGeneratingMeta(false);
    }
  };

  const generateHashtagsContent = async () => {
    if (!formData.title || !formData.description) {
      toast({
        variant: "destructive",
        title: "بيانات غير كافية",
        description: "يرجى إضافة العنوان والوصف أولاً",
      });
      return;
    }

    try {
      setIsGeneratingHashtags(true);
      const hashtagsData = await generateHashtags(formData.title, formData.description);
      
      if (hashtagsData && hashtagsData.length > 0) {
        setFormData(prev => ({
          ...prev,
          hashtags: hashtagsData.join(' ')
        }));
        
        toast({
          title: "تم التوليد بنجاح",
          description: "تم توليد الهاشتاغات بنجاح",
        });
      } else {
        throw new Error("فشل في توليد الهاشتاغات");
      }
    } catch (error) {
      console.error("Error generating hashtags:", error);
      toast({
        variant: "destructive",
        title: "خطأ في التوليد",
        description: "حدث خطأ أثناء توليد الهاشتاغات",
      });
    } finally {
      setIsGeneratingHashtags(false);
    }
  };

  return {
    isGeneratingMeta,
    isGeneratingHashtags,
    generateMetaContent,
    generateHashtagsContent
  };
}
