
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface LegalTabProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  updateSettings: any;
}

const LegalTab = ({ formData, handleInputChange, updateSettings }: LegalTabProps) => {
  return (
    <Card className="bg-crypto-darkGray/80 backdrop-blur-md border border-white/10 text-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-crypto-orange">الصفحات القانونية</CardTitle>
        <CardDescription className="text-gray-400">قم بتعديل محتوى الصفحات القانونية</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="privacy_policy" className="text-white">سياسة الخصوصية</Label>
          <Textarea 
            id="privacy_policy" 
            name="privacy_policy"
            value={formData.privacy_policy || ''} 
            onChange={handleInputChange}
            placeholder="أدخل محتوى سياسة الخصوصية هنا..." 
            rows={10}
            className="bg-crypto-darkBlue/30 border-white/10 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="terms_conditions" className="text-white">الشروط والأحكام</Label>
          <Textarea 
            id="terms_conditions" 
            name="terms_conditions"
            value={formData.terms_conditions || ''} 
            onChange={handleInputChange}
            placeholder="أدخل محتوى الشروط والأحكام هنا..." 
            rows={10}
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

export default LegalTab;
