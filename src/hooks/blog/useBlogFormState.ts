
import { useState, useEffect } from 'react';
import { BlogPost } from '@/types/supabase';

interface UseBlogFormStateProps {
  id?: string;
  initialData?: Partial<BlogPost> | null;
}

export function useBlogFormState({ id, initialData }: UseBlogFormStateProps = {}) {
  const isEditMode = !!id;
  
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
        const storageKey = isEditMode && id ? `blogFormData_${id}` : 'blogFormData_new';
        const savedData = localStorage.getItem(storageKey);
        
        if (savedData) {
          try {
            const parsedData = JSON.parse(savedData);
            
            setFormData({
              title: parsedData.title || '',
              content: parsedData.content || '',
              excerpt: parsedData.excerpt || '',
              author: parsedData.author || '',
              category: parsedData.category || '',
              slug: parsedData.slug || '',
              image_url: parsedData.image_url || '',
              publish_date: parsedData.publish_date || new Date().toISOString()
            });
          } catch (e) {
            // If parsing fails, continue with empty form
            console.error("Error parsing saved form data", e);
          }
        }
      }
    };
    
    loadFormData();
  }, [id, isEditMode, initialData]);
  
  // Save form data to localStorage whenever it changes
  useEffect(() => {
    // Only save if there's actual data
    if (formData.title || formData.content) {
      const storageKey = isEditMode && id ? `blogFormData_${id}` : 'blogFormData_new';
      localStorage.setItem(storageKey, JSON.stringify({
        ...formData,
        id: id
      }));
    }
  }, [formData, id, isEditMode]);
  
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

  const clearFormData = () => {
    const storageKey = isEditMode && id ? `blogFormData_${id}` : 'blogFormData_new';
    localStorage.removeItem(storageKey);
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
    clearFormData
  };
}
