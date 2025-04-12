
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Link as LinkIcon } from "lucide-react";

interface FooterTabProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  updateSettings: any;
}

const FooterTab = ({ formData, handleInputChange, updateSettings }: FooterTabProps) => {
  return (
    <Card className="bg-crypto-darkGray/80 backdrop-blur-md border border-white/10 text-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-crypto-orange">إعدادات التذييل</CardTitle>
        <CardDescription className="text-gray-400">قم بتعديل محتوى تذييل الموقع</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="footer_description" className="text-white">وصف التذييل</Label>
          <Textarea 
            id="footer_description" 
            name="footer_description"
            value={formData.footer_description || ''} 
            onChange={handleInputChange}
            placeholder="منصة عربية متخصصة في تقديم المعلومات والخدمات في مجال العملات المشفرة والبلوكتشين والويب 3.0" 
            rows={3}
            className="bg-crypto-darkBlue/30 border-white/10 text-white"
          />
        </div>
        
        <div className="mt-4">
          <p className="mb-2 text-gray-400">لتعديل روابط التذييل والروابط الاجتماعية، يرجى استخدام صفحة إدارة الروابط.</p>
          <Button 
            type="button" 
            className="bg-crypto-orange hover:bg-crypto-orange/90 text-white"
            onClick={() => window.location.href = '/admin/links'}
          >
            <LinkIcon className="h-4 w-4 ml-2" />
            إدارة الروابط
          </Button>
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

export default FooterTab;
