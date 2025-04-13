
import React from 'react';
import { NewAirdrop } from '@/types/supabase';
import BasicInfoSection from './form-sections/BasicInfoSection';
import SeoSection from './form-sections/SeoSection';
import TagsSection from './form-sections/TagsSection';
import StepsSection from './form-sections/StepsSection';

interface AirdropFormFieldsProps {
  formData: NewAirdrop & { meta_title?: string; meta_description?: string; hashtags?: string; steps?: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  isGeneratingMeta?: boolean;
  isGeneratingHashtags?: boolean;
  generateMetaContent?: () => void;
  generateHashtagsContent?: () => void;
}

const AirdropFormFields: React.FC<AirdropFormFieldsProps> = ({
  formData,
  handleChange,
  handleSelectChange,
  isGeneratingMeta,
  isGeneratingHashtags,
  generateMetaContent,
  generateHashtagsContent
}) => {
  return (
    <div className="space-y-6">
      {/* Basic Information Section */}
      <BasicInfoSection 
        formData={formData}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
      />
      
      {/* Steps Section */}
      <StepsSection
        formData={formData}
        handleChange={handleChange}
      />
      
      {/* SEO Section */}
      <SeoSection 
        formData={formData}
        handleChange={handleChange}
        isGeneratingMeta={isGeneratingMeta}
        generateMetaContent={generateMetaContent}
      />
      
      {/* Tags Section */}
      <TagsSection 
        formData={formData}
        handleChange={handleChange}
        isGeneratingHashtags={isGeneratingHashtags}
        generateHashtagsContent={generateHashtagsContent}
      />
    </div>
  );
};

export default AirdropFormFields;
