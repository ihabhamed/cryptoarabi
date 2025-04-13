
import { useEffect, useState } from 'react';
import { BlogPost } from '@/types/supabase';
import { saveFormData, getFormData } from '@/lib/utils/formStorage';

interface UseFormDataPersistenceProps {
  id?: string;
  storageKey: string;
  formData: Partial<BlogPost>;
  initialData?: Partial<BlogPost> | null;
  setFormData: (data: Partial<BlogPost> | ((prev: Partial<BlogPost>) => Partial<BlogPost>)) => void;
}

/**
 * Hook to manage form data persistence in localStorage
 */
export function useFormDataPersistence({
  id,
  storageKey,
  formData,
  initialData,
  setFormData
}: UseFormDataPersistenceProps) {
  const [lastSavedTimestamp, setLastSavedTimestamp] = useState<number>(Date.now());

  // Check for changes when visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
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
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [storageKey, lastSavedTimestamp, setFormData]);

  // Load data from localStorage or initial data
  useEffect(() => {
    const loadFormData = () => {
      if (initialData && Object.keys(initialData).length > 0) {
        console.log("Loading initial data:", initialData);
        // Ensure we have a slug in the initial data
        const dataWithDefaultSlug = {
          ...initialData,
          // If the slug is missing or "null", generate a temporary one
          slug: initialData.slug && initialData.slug !== 'null' 
            ? initialData.slug 
            : `post-temp-${new Date().getTime().toString().slice(-6)}`
        };
        
        setFormData(prevData => ({
          ...prevData,
          ...dataWithDefaultSlug
        }));
      } else {
        // Check localStorage based on edit mode
        const savedData = getFormData<Partial<BlogPost>>(storageKey);
        
        if (savedData) {
          console.log("Loading data from localStorage:", savedData);
          // Ensure we have a slug in the saved data
          const dataWithDefaultSlug = {
            ...savedData,
            // If the slug is missing or "null", generate a temporary one
            slug: savedData.slug && savedData.slug !== 'null' 
              ? savedData.slug 
              : `post-temp-${new Date().getTime().toString().slice(-6)}`
          };
          
          setFormData(prevData => ({
            ...prevData,
            ...dataWithDefaultSlug
          }));
        }
      }
    };
    
    loadFormData();
  }, [id, initialData, storageKey, setFormData]);
  
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

  const forceSync = () => {
    saveFormData(storageKey, {
      ...formData,
      id: id
    });
    setLastSavedTimestamp(Date.now());
  };

  return { forceSync, lastSavedTimestamp };
}
