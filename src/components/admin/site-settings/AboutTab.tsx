
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface AboutTabProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  updateSettings: any;
}

const AboutTab = ({ formData, handleInputChange, updateSettings }: AboutTabProps) => {
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
