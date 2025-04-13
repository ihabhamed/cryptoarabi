
import { useState, useEffect, useRef } from 'react';
import { BlogPost } from '@/types/supabase';
import { saveFormData, getFormData, clearFormData } from '@/lib/utils/formStorage';

interface UseBlogFormStateProps {
  id?: string;
  initialData?: Partial<BlogPost> | null;
}

export function useBlogFormState({ id, initialData }: UseBlogFormStateProps = {}) {
  const isEditMode = !!id;
  const storageKey = isEditMode && id ? `blogFormData_${id}` : 'blogFormData_new';
  const scrollPositionRef = useRef<number>(0);
  
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

  // Save scroll position when component loses focus
  useEffect(() => {
    const saveScrollPosition = () => {
      scrollPositionRef.current = window.scrollY;
    };

    // Save scroll position when window loses focus
    window.addEventListener('blur', saveScrollPosition);

    // Save scroll position when switching tabs
    document.addEventListener('visibilitychange', saveScrollPosition);

    return () => {
      window.removeEventListener('blur', saveScrollPosition);
      document.removeEventListener('visibilitychange', saveScrollPosition);
    };
  }, []);

  // Restore scroll position when component regains focus
  useEffect(() => {
    const restoreScrollPosition = () => {
      // Only restore if we have a saved position
      if (scrollPositionRef.current > 0) {
        setTimeout(() => {
          window.scrollTo(0, scrollPositionRef.current);
        }, 100);
      }
    };

    // Restore scroll position when window regains focus
    window.addEventListener('focus', restoreScrollPosition);

    // Restore scroll position when switching back to tab
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        restoreScrollPosition();
      }
    });

    return () => {
      window.removeEventListener('focus', restoreScrollPosition);
      document.removeEventListener('visibilitychange', restoreScrollPosition);
    };
  }, []);

  // Load data from localStorage or initial data
  useEffect(() => {
    const loadFormData = () => {
      if (initialData && Object.keys(initialData).length > 0) {
        console.log("Loading initial data:", initialData);
        // Ensure we have a slug in the initial data
        const dataWithDefaultSlug = {
          ...initialData,
          // If the slug is missing or "null", generate a temporary one
          slug: initialData.slug && initialData.slug !== 'null' ? initialData.slug : `post-temp-${new Date().getTime().toString().slice(-6)}`
        };
        
        setFormData({
          ...formData,
          ...dataWithDefaultSlug
        });
      } else {
        // Check localStorage based on edit mode
        const savedData = getFormData<Partial<BlogPost>>(storageKey);
        
        if (savedData) {
          console.log("Loading data from localStorage:", savedData);
          // Ensure we have a slug in the saved data
          const dataWithDefaultSlug = {
            ...savedData,
            // If the slug is missing or "null", generate a temporary one
            slug: savedData.slug && savedData.slug !== 'null' ? savedData.slug : `post-temp-${new Date().getTime().toString().slice(-6)}`
          };
          
          setFormData({
            ...formData,
            ...dataWithDefaultSlug
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
      
      // Make sure we always have a slug before saving to localStorage
      const dataToSave = { ...formData };
      if (!dataToSave.slug || dataToSave.slug === 'null' || dataToSave.slug.trim() === '') {
        const timestamp = new Date().getTime().toString().slice(-6);
        dataToSave.slug = dataToSave.title 
          ? `${dataToSave.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').substring(0, 30)}-${timestamp}`
          : `post-${timestamp}`;
      }
      
      saveFormData(storageKey, {
        ...dataToSave,
        id: id
      });
    }
  }, [formData, id, storageKey]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`Field changed: ${name} = ${value}`);
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug if title changes and slug is empty
    if (name === 'title' && (!formData.slug || formData.slug === 'null')) {
      generateSlug();
    }
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
          .replace(/-+/g, '-')       // Replace multiple hyphens with a single one
          .replace(/^-+|-+$/g, '')   // Remove hyphens from start and end
          .concat(`-${timestamp}`);  // Add timestamp for uniqueness
      }
      
      console.log("Generated slug in form state:", slug);
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
    clearFormData: clearFormDataState,
    scrollPositionRef
  };
}
