
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
  const [lastSavedTimestamp, setLastSavedTimestamp] = useState<number>(Date.now());

  // Save scroll position when component loses focus or tab is switched
  useEffect(() => {
    const saveScrollPosition = () => {
      scrollPositionRef.current = window.scrollY;
      localStorage.setItem(`${storageKey}_scrollPos`, scrollPositionRef.current.toString());
      
      // Force save form data when tab/window loses focus
      saveFormData(storageKey, {
        ...formData,
        id: id
      });
      setLastSavedTimestamp(Date.now());
    };

    // Save when window/tab loses focus
    window.addEventListener('blur', saveScrollPosition);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        saveScrollPosition();
      }
    });

    // Also add a listener for the custom 'forcesave' event
    const handleForceSave = () => {
      saveScrollPosition();
    };
    
    document.addEventListener('forcesave', handleForceSave);

    return () => {
      window.removeEventListener('blur', saveScrollPosition);
      document.removeEventListener('visibilitychange', saveScrollPosition);
      document.removeEventListener('forcesave', handleForceSave);
    };
  }, [formData, id, storageKey]);

  // Restore scroll position when component regains focus
  useEffect(() => {
    const restoreScrollPosition = () => {
      // Try to get saved position from localStorage first
      const savedPos = localStorage.getItem(`${storageKey}_scrollPos`);
      
      if (savedPos) {
        const parsedPos = parseInt(savedPos, 10);
        scrollPositionRef.current = parsedPos;
        
        setTimeout(() => {
          window.scrollTo(0, parsedPos);
        }, 100);
      } else if (scrollPositionRef.current > 0) {
        // Fallback to ref if localStorage doesn't have the value
        setTimeout(() => {
          window.scrollTo(0, scrollPositionRef.current);
        }, 100);
      }
    };

    // Restore when window/tab regains focus
    window.addEventListener('focus', restoreScrollPosition);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        restoreScrollPosition();
        
        // Check if we need to reload data from localStorage
        const savedTimestamp = localStorage.getItem(`${storageKey}_timestamp`);
        if (savedTimestamp && parseInt(savedTimestamp, 10) > lastSavedTimestamp) {
          const savedData = getFormData<Partial<BlogPost>>(storageKey);
          if (savedData) {
            setFormData(prevData => ({
              ...prevData,
              ...savedData
            }));
            setLastSavedTimestamp(parseInt(savedTimestamp, 10));
          }
        }
      }
    });

    // Initial restoration when component mounts
    restoreScrollPosition();

    return () => {
      window.removeEventListener('focus', restoreScrollPosition);
      document.removeEventListener('visibilitychange', restoreScrollPosition);
    };
  }, [storageKey, lastSavedTimestamp]);

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
      
      // Save timestamp of last save for comparison
      localStorage.setItem(`${storageKey}_timestamp`, Date.now().toString());
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
    localStorage.removeItem(`${storageKey}_scrollPos`);
    localStorage.removeItem(`${storageKey}_timestamp`);
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
