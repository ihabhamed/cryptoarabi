
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface GeneralTabProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  updateSettings: any;
}

const GeneralTab = ({ formData, handleInputChange, updateSettings }: GeneralTabProps) => {
  return (
    <Card className="bg-crypto-darkGray/80 backdrop-blur-md border border-white/10 text-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-crypto-orange">الإعدادات العامة</CardTitle>
        <CardDescription className="text-gray-400">قم بتعديل الإعدادات العامة للموقع</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="site_name" className="text-white">اسم الموقع</Label>
          <Input 
            id="site_name" 
            name="site_name" 
            value={formData.site_name || ''} 
            onChange={handleInputChange}
            placeholder="كريبتوعرب" 
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

export default GeneralTab;
