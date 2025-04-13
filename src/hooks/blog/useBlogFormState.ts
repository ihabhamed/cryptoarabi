
import { useState } from 'react';
import { BlogPost } from '@/types/supabase';
import { clearFormData } from '@/lib/utils/formStorage';
import { useScrollPosition } from './form-state/useScrollPosition';
import { useFormDataPersistence } from './form-state/useFormDataPersistence';
import { useSlugGenerator } from './form-state/useSlugGenerator';

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

  // Use the scroll position hook
  const { scrollPositionRef } = useScrollPosition({ storageKey });

  // Use the form data persistence hook
  const { forceSync } = useFormDataPersistence({
    id,
    storageKey,
    formData,
    initialData,
    setFormData
  });

  // Use the slug generator hook
  const { generateSlug } = useSlugGenerator({ formData, setFormData });

  // Save form data and scroll position when tab/window loses focus
  const saveFormState = () => {
    forceSync();
    // Manually dispatch the forcesave event to save scroll position
    document.dispatchEvent(new Event('forcesave'));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`Field changed: ${name} = ${value}`);
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug if title changes and slug is empty
    if (name === 'title' && (!formData.slug || formData.slug === 'null')) {
      generateSlug();
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
    scrollPositionRef,
    saveFormState
  };
}
