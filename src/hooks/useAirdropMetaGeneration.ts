
import { useState } from 'react';
import { generateMetaTags, generateHashtags } from '@/lib/utils/geminiApi';
import { toast } from "@/lib/utils/toast-utils";

interface UseAirdropMetaGenerationProps {
  formData: {
    title: string;
    description?: string; // Optional to match NewAirdrop type
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
    if (!formData.title) {
      toast({
        variant: "destructive",
        title: "بيانات غير كافية",
        description: "يرجى إضافة العنوان على الأقل",
      });
      return;
    }

    try {
      setIsGeneratingMeta(true);
      // Use description if available, otherwise use an empty string for content
      const description = formData.description || '';
      const metaData = await generateMetaTags(formData.title, description);
      
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
        console.warn("Missing meta data fields in response:", metaData);
        toast({
          variant: "destructive",
          title: "نتائج غير مكتملة",
          description: "تم توليد بيانات الميتا بشكل جزئي، يرجى المحاولة مرة أخرى",
        });
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

  // Keeping the hashtags generation separate from meta generation
  const generateHashtagsContent = async () => {
    if (!formData.title) {
      toast({
        variant: "destructive",
        title: "بيانات غير كافية",
        description: "يرجى إضافة العنوان على الأقل",
      });
      return;
    }

    try {
      setIsGeneratingHashtags(true);
      // Use description if available, otherwise use an empty string
      const description = formData.description || '';
      const hashtagsData = await generateHashtags(formData.title, description);
      
      if (hashtagsData && hashtagsData.length > 0) {
        setFormData(prev => ({
          ...prev,
          hashtags: hashtagsData.join(' ')
        }));
        
        toast({
          title: "تم التوليد بنجاح",
          description: `تم توليد ${hashtagsData.length} هاشتاغات بنجاح`,
        });
      } else {
        throw new Error("لم نتمكن من توليد هاشتاغات للمحتوى الحالي");
      }
    } catch (error: any) {
      console.error("Error generating hashtags:", error);
      toast({
        variant: "destructive",
        title: "خطأ في التوليد",
        description: error.message || "حدث خطأ أثناء توليد الهاشتاغات",
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
