
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { SiteSettings } from '@/lib/hooks/useSiteSettings';

interface TestimonialsTabProps {
  formData: Partial<SiteSettings>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  updateSettings: any;
}

const TestimonialsTab = ({ formData, handleInputChange, updateSettings }: TestimonialsTabProps) => {
  // Handle toggle switch changes
  const handleSwitchChange = (checked: boolean, fieldName: string) => {
    const customEvent = {
      target: {
        name: fieldName,
        value: checked
      }
    } as any;
    
    handleInputChange(customEvent);
  };

  return (
    <Card className="bg-crypto-darkGray/80 backdrop-blur-md border border-white/10 text-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-crypto-orange">قسم آراء العملاء</CardTitle>
        <CardDescription className="text-gray-400">قم بإدارة قسم آراء العملاء في الصفحة الرئيسية</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Section visibility toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="show_testimonials_section" className="text-white">إظهار قسم "آراء العملاء"</Label>
            <p className="text-xs text-gray-400">عند تفعيل هذا الخيار، سيظهر قسم "آراء العملاء" في الصفحة الرئيسية</p>
          </div>
          <Switch 
            id="show_testimonials_section"
            checked={formData.show_testimonials_section !== false} // Default to true if undefined
            onCheckedChange={(checked) => handleSwitchChange(checked, 'show_testimonials_section')}
            className="data-[state=checked]:bg-crypto-orange"
          />
        </div>
        
        <div className="p-4 bg-crypto-darkBlue/20 rounded-lg border border-white/10">
          <p className="text-sm text-gray-300">
            ملاحظة: لإدارة التقييمات والآراء بشكل كامل، سيتم إضافة ميزة إدارة الآراء في تحديث مستقبلي. حالياً يمكنك فقط إخفاء أو إظهار القسم.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          className="bg-crypto-orange hover:bg-crypto-orange/90 text-white w-full sm:w-auto"
          disabled={updateSettings.isPending}
        >
          {updateSettings.isPending ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TestimonialsTab;
