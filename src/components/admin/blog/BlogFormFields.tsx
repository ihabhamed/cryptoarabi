
import React from 'react';
import { BlogPost } from '@/types/supabase';
import BasicInfoSection from './form-sections/BasicInfoSection';
import SeoSection from './form-sections/SeoSection';
import TagsSection from './form-sections/TagsSection';

interface BlogFormFieldsProps {
  formData: Partial<BlogPost & { meta_title?: string; meta_description?: string; hashtags?: string }>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  generateSlug: () => void;
}

const BlogFormFields: React.FC<BlogFormFieldsProps> = ({
  formData,
  handleChange,
  generateSlug,
}) => {
  return (
    <div className="space-y-6">
      {/* Basic Information Section */}
      <BasicInfoSection 
        formData={formData}
        handleChange={handleChange}
        generateSlug={generateSlug}
      />
      
      {/* SEO Section */}
      <div className="border-t border-white/10 pt-6 mt-6">
        <SeoSection 
          formData={formData}
          handleChange={handleChange}
        />
      </div>
      
      {/* Tags Section */}
      <div className="border-t border-white/10 pt-6 mt-6">
        <TagsSection 
          formData={formData}
          handleChange={handleChange}
        />
      </div>
    </div>
  );
};

export default BlogFormFields;
