
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from 'lucide-react';

interface AboutTabProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  updateSettings: any;
}

const AboutTab = ({ formData, handleInputChange, updateSettings }: AboutTabProps) => {
  const [features, setFeatures] = useState<string[]>(
    formData.about_features && Array.isArray(formData.about_features) 
      ? formData.about_features 
      : [
          "فريق من الخبراء المتخصصين في البلوكتشين والعملات المشفرة",
          "أكثر من 5 سنوات من الخبرة في مجال الويب 3.0",
          "استشارات مخصصة لاحتياجات عملك الفريدة",
          "دعم فني على مدار الساعة طوال أيام الأسبوع"
        ]
  );

  // Update local features state when formData changes
  useEffect(() => {
    if (formData.about_features && Array.isArray(formData.about_features)) {
      setFeatures(formData.about_features);
    }
  }, [formData.about_features]);

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = value;
    setFeatures(updatedFeatures);
    
    // Update the form data by calling the parent handler
    // Cast to any to avoid type errors with the synthetic event
    handleInputChange({
      target: {
        name: 'about_features',
        value: updatedFeatures
      }
    } as any);
  };

  const addFeature = () => {
    const updatedFeatures = [...features, ""];
    setFeatures(updatedFeatures);
    
    // Update the form data
    handleInputChange({
      target: {
        name: 'about_features',
        value: updatedFeatures
      }
    } as any);
  };

  const removeFeature = (index: number) => {
    if (features.length <= 1) return; // Keep at least one feature
    
    const updatedFeatures = features.filter((_, i) => i !== index);
    setFeatures(updatedFeatures);
    
    // Update the form data
    handleInputChange({
      target: {
        name: 'about_features',
        value: updatedFeatures
      }
    } as any);
  };

  return (
    <Card className="bg-crypto-darkGray/80 backdrop-blur-md border border-white/10 text-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-crypto-orange">قسم من نحن</CardTitle>
        <CardDescription className="text-gray-400">قم بتعديل محتوى قسم من نحن</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="about_title" className="text-white">عنوان قسم من نحن</Label>
          <Input 
            id="about_title" 
            name="about_title"
            value={formData.about_title || ''} 
            onChange={handleInputChange}
            placeholder="من نحن" 
            className="bg-crypto-darkBlue/30 border-white/10 text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="about_content" className="text-white">محتوى قسم من نحن</Label>
          <Textarea 
            id="about_content" 
            name="about_content"
            value={formData.about_content || ''} 
            onChange={handleInputChange}
            placeholder="نحن فريق من الخبراء المتخصصين في مجال العملات المشفرة والبلوكتشين والويب 3.0..." 
            rows={6}
            className="bg-crypto-darkBlue/30 border-white/10 text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="about_year_founded" className="text-white">سنة التأسيس</Label>
          <Input 
            id="about_year_founded" 
            name="about_year_founded"
            value={formData.about_year_founded || '2018'} 
            onChange={handleInputChange}
            placeholder="2018" 
            className="bg-crypto-darkBlue/30 border-white/10 text-white"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-2">
            <Label className="text-white">مميزات الشركة</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addFeature}
              className="border-crypto-orange text-crypto-orange hover:bg-crypto-orange/20"
            >
              <Plus className="h-4 w-4 mr-1" /> إضافة ميزة
            </Button>
          </div>
          
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <Input 
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                placeholder="أدخل ميزة"
                className="bg-crypto-darkBlue/30 border-white/10 text-white"
              />
              <Button 
                type="button" 
                variant="destructive" 
                size="icon" 
                onClick={() => removeFeature(index)}
                className="flex-shrink-0"
                disabled={features.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="about_image_url" className="text-white">رابط صورة قسم من نحن</Label>
          <Input 
            id="about_image_url" 
            name="about_image_url"
            value={formData.about_image_url || ''} 
            onChange={handleInputChange}
            placeholder="https://example.com/image.jpg" 
            className="bg-crypto-darkBlue/30 border-white/10 text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="about_button_text" className="text-white">نص زر قسم من نحن</Label>
          <Input 
            id="about_button_text" 
            name="about_button_text"
            value={formData.about_button_text || 'اعرف المزيد عنا'} 
            onChange={handleInputChange}
            placeholder="اعرف المزيد عنا" 
            className="bg-crypto-darkBlue/30 border-white/10 text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="about_button_url" className="text-white">رابط زر قسم من نحن</Label>
          <Input 
            id="about_button_url" 
            name="about_button_url"
            value={formData.about_button_url || '/about'} 
            onChange={handleInputChange}
            placeholder="/about" 
            className="bg-crypto-darkBlue/30 border-white/10 text-white"
          />
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

export default AboutTab;
