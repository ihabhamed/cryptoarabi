
import { useState, useEffect } from 'react';
import { BlogPost } from '@/types/supabase';
import { saveFormData, getFormData, clearFormData } from '@/lib/utils/formStorage';

interface UseBlogFormStateProps {
  id?: string;
  initialData?: Partial<BlogPost> | null;
}

export function useBlogFormState({ id, initialData }: UseBlogFormStateProps = {}) {
  const isEditMode = !!id;
  const storageKey = isEditMode && id ? `blogFormData_${id}` : 'blogFormData_new';
  
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    category: '',
    slug: '',
    image_url: '',
    meta_title: '',
    meta_description: '',
    hashtags: '',
    publish_date: new Date().toISOString()
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load data from localStorage or initial data
  useEffect(() => {
    const loadFormData = () => {
      if (initialData && Object.keys(initialData).length > 0) {
        console.log("Loading initial data:", initialData);
        setFormData({
          ...formData,
          ...initialData
        });
      } else {
        // Check localStorage based on edit mode
        const savedData = getFormData<Partial<BlogPost>>(storageKey);
        
        if (savedData) {
          console.log("Loading data from localStorage:", savedData);
          setFormData({
            ...formData,
            ...savedData
          });
        }
      }
    };
    
    loadFormData();
  }, [id, initialData, storageKey]);
  
  // Save form data to localStorage whenever it changes
  useEffect(() => {
    // Only save if there's actual data
    if (formData.title || formData.content) {
      console.log("Saving form data to localStorage:", formData);
      saveFormData(storageKey, {
        ...formData,
        id: id
      });
    }
  }, [formData, id, storageKey]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`Field changed: ${name} = ${value}`);
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Generate slug from title - used as a fallback to the more robust method in BasicInfoSection
  const generateSlug = () => {
    if (formData.title) {
      // Generate a timestamp-based component for uniqueness
      const timestamp = new Date().getTime().toString().slice(-6);
      let slug = '';
      
      // Check if title contains Arabic characters
      if (/[\u0600-\u06FF]/.test(formData.title)) {
        // For Arabic text, use a generic post slug with timestamp
        slug = `post-${timestamp}`;
      } else {
        // For Latin text, use the standard slug generator with timestamp appended
        slug = formData.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')  // Remove special characters except hyphens
          .replace(/\s+/g, '-')      // Replace spaces with hyphens
          .concat(`-${timestamp}`);  // Add timestamp for uniqueness
      }
      
      // Ensure the slug doesn't have double hyphens and trim any leading/trailing hyphens
      slug = slug.replace(/-+/g, '-').replace(/^-+|-+$/g, '');
      
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const clearFormDataState = () => {
    clearFormData(storageKey);
  };

  return {
    formData,
    setFormData,
    isLoading,
    setIsLoading,
    isSaving,
    setIsSaving,
    isEditMode,
    handleChange,
    generateSlug,
    clearFormData: clearFormDataState
  };
}
