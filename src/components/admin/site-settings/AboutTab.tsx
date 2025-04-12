
/**
 * AboutTab Component
 * 
 * This component renders the About section tab in the site settings admin panel.
 * It allows administrators to edit about section content, including features list.
 */
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SiteSettings } from '@/lib/hooks/useSiteSettings';
import FeaturesList from './FeaturesList';
import ButtonSettings from './ButtonSettings';

interface AboutTabProps {
  formData: Partial<SiteSettings>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  updateSettings: any; // Mutation object from useUpdateSiteSettings
}

/**
 * AboutTab Component
 * Renders form fields for managing "About" section content in site settings
 */
const AboutTab = ({ formData, handleInputChange, updateSettings }: AboutTabProps) => {
  // Initialize features from formData, handling various possible data types
  const [features, setFeatures] = React.useState<string[]>(() => {
    if (Array.isArray(formData.about_features)) {
      return formData.about_features;
    } else if (typeof formData.about_features === 'string') {
      try {
        // Try to parse if it's a JSON string
        const parsedFeatures = JSON.parse(formData.about_features);
        return Array.isArray(parsedFeatures) ? parsedFeatures : [formData.about_features];
      } catch {
        // If parsing fails, treat as a single feature
        return [formData.about_features];
      }
    }
    return []; // Default to empty array
  });
  
  // Update parent formData when features change
  React.useEffect(() => {
    // Create a synthetic event to update formData
    const customEvent = {
      target: {
        name: 'about_features',
        value: features
      }
    } as any; // Type assertion for custom event
    
    handleInputChange(customEvent);
  }, [features, handleInputChange]);

  return (
    <Card className="bg-crypto-darkGray/80 backdrop-blur-md border border-white/10 text-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-crypto-orange">قسم من نحن</CardTitle>
        <CardDescription className="text-gray-400">قم بتعديل محتوى قسم من نحن</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* About title field */}
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

        {/* About content field */}
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

        {/* Year founded field */}
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

        {/* About image URL field */}
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
        
        {/* Features list component */}
        <FeaturesList 
          features={features} 
          onChange={setFeatures} 
        />
        
        {/* Button settings component */}
        <ButtonSettings 
          buttonText={formData.about_button_text || ''}
          buttonUrl={formData.about_button_url || ''}
          onTextChange={handleInputChange}
          onUrlChange={handleInputChange}
        />
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
