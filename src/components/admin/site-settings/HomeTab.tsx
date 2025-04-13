
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/lib/utils/toast-utils";
import { useSiteSettings, useUpdateSiteSettings } from '@/lib/hooks';

const HomeTab = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSiteSettings = useUpdateSiteSettings();

  const handleToggleSection = async (sectionName: string, value: boolean) => {
    try {
      if (settings) {
        updateSiteSettings.mutate({
          id: settings.id,
          [sectionName]: value
        });
        
        toast({
          title: "تم التحديث",
          description: `تم ${value ? 'تفعيل' : 'إخفاء'} القسم بنجاح`,
        });
      }
    } catch (error) {
      console.error('Error updating section visibility:', error);
      toast({
        variant: "destructive",
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تحديث إعدادات الموقع",
      });
    }
  };
  
  if (isLoading) {
    return <div className="animate-pulse p-4 space-y-4">
      <div className="h-4 bg-gray-700 rounded w-1/3"></div>
      <div className="h-10 bg-gray-700 rounded"></div>
      <div className="h-4 bg-gray-700 rounded w-1/4"></div>
      <div className="h-10 bg-gray-700 rounded"></div>
    </div>;
  }

  // Check if blog section toggle is supported
  const isBlogSectionToggleSupported = 'show_blog_section' in (settings || {});

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white mb-4">الأقسام المعروضة</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="about-section" className="text-white">قسم "من نحن"</Label>
              <p className="text-sm text-gray-400">إظهار أو إخفاء قسم "من نحن" في الصفحة الرئيسية</p>
            </div>
            <Switch 
              id="about-section" 
              checked={settings?.show_about_section ?? true}
              onCheckedChange={(checked) => handleToggleSection('show_about_section', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="testimonials-section" className="text-white">قسم "آراء العملاء"</Label>
              <p className="text-sm text-gray-400">إظهار أو إخفاء قسم "آراء العملاء" في الصفحة الرئيسية</p>
            </div>
            <Switch 
              id="testimonials-section" 
              checked={settings?.show_testimonials_section ?? true}
              onCheckedChange={(checked) => handleToggleSection('show_testimonials_section', checked)}
            />
          </div>
          
          {isBlogSectionToggleSupported ? (
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="blog-section" className="text-white">قسم "المدونة"</Label>
                <p className="text-sm text-gray-400">إظهار أو إخفاء قسم "المدونة" في الصفحة الرئيسية والقائمة</p>
              </div>
              <Switch 
                id="blog-section" 
                checked={settings?.show_blog_section ?? true}
                onCheckedChange={(checked) => handleToggleSection('show_blog_section', checked)}
              />
            </div>
          ) : (
            <div className="flex items-center justify-between bg-yellow-900/20 p-3 rounded-md">
              <div>
                <Label htmlFor="blog-section" className="text-white">قسم "المدونة"</Label>
                <p className="text-sm text-yellow-400">يجب تحديث قاعدة البيانات لدعم هذه الميزة. اتصل بمسؤول النظام.</p>
              </div>
              <Switch 
                id="blog-section" 
                checked={true}
                disabled={true}
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="border-t border-white/10 pt-6">
        <h3 className="text-lg font-medium text-white mb-4">إعدادات القسم الرئيسي</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="hero-headline" className="text-white">العنوان الرئيسي</Label>
            <Input
              id="hero-headline"
              defaultValue={settings?.hero_headline || ''}
              placeholder="العنوان الرئيسي للصفحة"
              className="bg-crypto-darkBlue/50 border-white/20 text-white"
              onChange={(e) => {
                // Handle hero headline changes here if needed
              }}
            />
          </div>
          
          <div>
            <Label htmlFor="hero-description" className="text-white">النص التوضيحي</Label>
            <Textarea
              id="hero-description"
              defaultValue={settings?.hero_description || ''}
              placeholder="النص التوضيحي للصفحة الرئيسية"
              className="bg-crypto-darkBlue/50 border-white/20 text-white min-h-[100px]"
              onChange={(e) => {
                // Handle description changes here if needed
              }}
            />
          </div>
          
          <div>
            <Label htmlFor="hero-cta-text" className="text-white">نص زر الدعوة للإجراء</Label>
            <Input
              id="hero-cta-text"
              defaultValue={settings?.hero_cta_text || ''}
              placeholder="مثال: ابدأ الآن"
              className="bg-crypto-darkBlue/50 border-white/20 text-white"
              onChange={(e) => {
                // Handle CTA text changes here if needed
              }}
            />
          </div>
          
          <div>
            <Label htmlFor="hero-video-url" className="text-white">رابط فيديو الخلفية (اختياري)</Label>
            <Input
              id="hero-video-url"
              defaultValue={settings?.hero_video_url || ''}
              placeholder="https://example.com/video.mp4"
              className="bg-crypto-darkBlue/50 border-white/20 text-white"
              onChange={(e) => {
                // Handle video URL changes here if needed
              }}
            />
            <p className="text-xs text-gray-400 mt-1">يجب أن يكون الفيديو بصيغة MP4 ومحسن للويب</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeTab;
