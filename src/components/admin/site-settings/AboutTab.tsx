
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";
import { SiteSettings } from '@/lib/hooks/useSiteSettings';

interface AboutTabProps {
  formData: Partial<SiteSettings>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  updateSettings: any;
}

const AboutTab = ({ formData, handleInputChange, updateSettings }: AboutTabProps) => {
  // Handle features as an array
  const [features, setFeatures] = React.useState<string[]>(
    Array.isArray(formData.about_features) 
      ? formData.about_features 
      : typeof formData.about_features === 'string' 
        ? [formData.about_features] 
        : []
  );
  
  const [newFeature, setNewFeature] = React.useState('');

  // Update formData when features change
  React.useEffect(() => {
    const event = {
      target: {
        name: 'about_features',
        value: features
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(event);
  }, [features, handleInputChange]);

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFeature();
    }
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
            value={formData.about_year_founded || ''} 
            onChange={handleInputChange}
            placeholder="2018" 
            className="bg-crypto-darkBlue/30 border-white/10 text-white"
          />
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
          <Label className="text-white">مميزات الشركة</Label>
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <Input 
                  value={feature}
                  onChange={(e) => {
                    const newFeatures = [...features];
                    newFeatures[index] = e.target.value;
                    setFeatures(newFeatures);
                  }}
                  className="bg-crypto-darkBlue/30 border-white/10 text-white"
                />
                <Button 
                  type="button" 
                  variant="destructive"
                  onClick={() => removeFeature(index)}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Input 
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="أضف ميزة جديدة..."
                className="bg-crypto-darkBlue/30 border-white/10 text-white"
              />
              <Button 
                type="button" 
                variant="secondary"
                onClick={addFeature}
                disabled={!newFeature.trim()}
                className="shrink-0"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                إضافة
              </Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="about_button_text" className="text-white">نص زر من نحن</Label>
          <Input 
            id="about_button_text" 
            name="about_button_text"
            value={formData.about_button_text || ''} 
            onChange={handleInputChange}
            placeholder="اعرف المزيد عنا" 
            className="bg-crypto-darkBlue/30 border-white/10 text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="about_button_url" className="text-white">رابط زر من نحن</Label>
          <Input 
            id="about_button_url" 
            name="about_button_url"
            value={formData.about_button_url || ''} 
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
