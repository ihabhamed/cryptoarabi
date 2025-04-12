
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface HomeTabProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  updateSettings: any;
}

const HomeTab = ({ formData, handleInputChange, updateSettings }: HomeTabProps) => {
  return (
    <Card className="bg-crypto-darkGray/80 backdrop-blur-md border border-white/10 text-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-crypto-orange">إعدادات الصفحة الرئيسية</CardTitle>
        <CardDescription className="text-gray-400">قم بتعديل محتوى الصفحة الرئيسية</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4 text-crypto-orange">قسم الترحيب</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero_title" className="text-white">العنوان الرئيسي</Label>
                <Input 
                  id="hero_title" 
                  name="hero_title"
                  value={formData.hero_title || ''} 
                  onChange={handleInputChange}
                  placeholder="مستقبل المال الرقمي يبدأ من هنا" 
                  className="bg-crypto-darkBlue/30 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero_subtitle" className="text-white">العنوان الفرعي</Label>
                <Textarea 
                  id="hero_subtitle" 
                  name="hero_subtitle"
                  value={formData.hero_subtitle || ''} 
                  onChange={handleInputChange}
                  placeholder="استكشف عالم العملات المشفرة..." 
                  rows={3}
                  className="bg-crypto-darkBlue/30 border-white/10 text-white"
                />
              </div>
            </div>
          </div>
          
          <Separator className="bg-white/10" />
          
          <div>
            <h3 className="text-lg font-medium mb-4 text-crypto-orange">أزرار الدعوة للإجراء</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cta_primary_text" className="text-white">نص الزر الرئيسي</Label>
                <Input 
                  id="cta_primary_text" 
                  name="cta_primary_text"
                  value={formData.cta_primary_text || ''} 
                  onChange={handleInputChange}
                  placeholder="ابدأ رحلتك" 
                  className="bg-crypto-darkBlue/30 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cta_secondary_text" className="text-white">نص الزر الثانوي</Label>
                <Input 
                  id="cta_secondary_text" 
                  name="cta_secondary_text"
                  value={formData.cta_secondary_text || ''} 
                  onChange={handleInputChange}
                  placeholder="تعلم المزيد" 
                  className="bg-crypto-darkBlue/30 border-white/10 text-white"
                />
              </div>
            </div>
          </div>
          
          <Separator className="bg-white/10" />
          
          <div>
            <h3 className="text-lg font-medium mb-4 text-crypto-orange">إحصائيات الموقع</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="active_users_count" className="text-white">عدد المستخدمين النشطين</Label>
                <Input 
                  id="active_users_count" 
                  name="active_users_count"
                  value={formData.active_users_count || ''} 
                  onChange={handleInputChange}
                  placeholder="+١٠٠ ألف" 
                  className="bg-crypto-darkBlue/30 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="successful_projects_count" className="text-white">عدد المشاريع الناجحة</Label>
                <Input 
                  id="successful_projects_count" 
                  name="successful_projects_count"
                  value={formData.successful_projects_count || ''} 
                  onChange={handleInputChange}
                  placeholder="+٥٠" 
                  className="bg-crypto-darkBlue/30 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support_hours" className="text-white">ساعات الدعم الفني</Label>
                <Input 
                  id="support_hours" 
                  name="support_hours"
                  value={formData.support_hours || ''} 
                  onChange={handleInputChange}
                  placeholder="٢٤/٧" 
                  className="bg-crypto-darkBlue/30 border-white/10 text-white"
                />
              </div>
            </div>
          </div>
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

export default HomeTab;
