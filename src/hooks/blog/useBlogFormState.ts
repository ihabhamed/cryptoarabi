
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
    publish_date: new Date().toISOString()
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load data from localStorage or initial data
  useEffect(() => {
    const loadFormData = () => {
      if (initialData) {
        setFormData(initialData);
      } else {
        // Check localStorage based on edit mode
        const savedData = getFormData<Partial<BlogPost>>(storageKey);
        
        if (savedData) {
          setFormData({
            title: savedData.title || '',
            content: savedData.content || '',
            excerpt: savedData.excerpt || '',
            author: savedData.author || '',
            category: savedData.category || '',
            slug: savedData.slug || '',
            image_url: savedData.image_url || '',
            meta_title: savedData.meta_title || '',
            meta_description: savedData.meta_description || '',
            hashtags: savedData.hashtags || '',
            publish_date: savedData.publish_date || new Date().toISOString()
          });
        }
      }
    };
    
    loadFormData();
  }, [id, isEditMode, initialData, storageKey]);
  
  // Save form data to localStorage whenever it changes
  useEffect(() => {
    // Only save if there's actual data
    if (formData.title || formData.content) {
      saveFormData(storageKey, {
        ...formData,
        id: id
      });
    }
  }, [formData, id, storageKey]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const generateSlug = () => {
    if (formData.title) {
      // Generate slug from title - remove special chars, replace spaces with dashes, lowercase
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      
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
