
import { useState, useEffect, useRef, useCallback } from 'react';
import { NewAirdrop } from '@/types/airdrop';
import { saveFormData, getFormData, getStorageKey, clearFormData } from '@/lib/utils/formStorage';

interface UseAirdropStorageProps {
  id?: string;
  isEditMode: boolean;
  initialData?: NewAirdrop & { 
    meta_title?: string; 
    meta_description?: string;
    hashtags?: string;
    steps?: string;
  };
}

/**
 * Hook for managing airdrop form data persistence in localStorage
 */
export function useAirdropStorage({ id, isEditMode, initialData }: UseAirdropStorageProps) {
  const [formData, setFormData] = useState<NewAirdrop & { 
    meta_title?: string; 
    meta_description?: string; 
    hashtags?: string;
    steps?: string;
  }>({
    title: '',
    description: '',
    status: 'upcoming',
    twitter_link: '',
    youtube_link: '',
    claim_url: '',
    start_date: '',
    end_date: '',
    image_url: '',
    publish_date: new Date().toISOString(),
    meta_title: '',
    meta_description: '',
    hashtags: '',
    steps: '',
  });
  
  // Use a ref to track the current form data for the debounced save function
  const formDataRef = useRef(formData);
  // Use a ref to track the last saved data to avoid unnecessary saves
  const lastSavedDataRef = useRef<string>('');
  // Use a ref to track the save timeout
  const saveTimeoutRef = useRef<number | null>(null);
  // Track if we've initialized the form
  const hasInitializedRef = useRef(false);

  // Update the ref whenever formData changes
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Load data from localStorage or initial data
  useEffect(() => {
    // Skip if we've already initialized
    if (hasInitializedRef.current) return;
    
    const storageKey = getStorageKey("airdrop", isEditMode, id);
    
    if (initialData) {
      // Set initial data
      setFormData({
        ...initialData,
        meta_title: initialData.meta_title || initialData.title || '',
        meta_description: initialData.meta_description || initialData.description || '',
        hashtags: initialData.hashtags || '',
        steps: initialData.steps || '',
      });
      
      // Save to localStorage with unique key only if it's not already there
      const existingData = getFormData(storageKey);
      if (!existingData) {
        saveFormData(storageKey, { ...initialData, id });
        lastSavedDataRef.current = JSON.stringify({ ...initialData, id });
      }
    } else if (!isEditMode) {
      // For new entry, check localStorage
      const savedData = getFormData<NewAirdrop & { 
        id?: string; 
        meta_title?: string; 
        meta_description?: string;
        hashtags?: string;
        steps?: string;
      }>(storageKey);
      
      if (savedData) {
        const loadedData = {
          title: savedData.title || '',
          description: savedData.description || '',
          status: savedData.status || 'upcoming',
          twitter_link: savedData.twitter_link || '',
          youtube_link: savedData.youtube_link || '',
          claim_url: savedData.claim_url || '',
          start_date: savedData.start_date || '',
          end_date: savedData.end_date || '',
          image_url: savedData.image_url || '',
          publish_date: savedData.publish_date || new Date().toISOString(),
          meta_title: savedData.meta_title || '',
          meta_description: savedData.meta_description || '',
          hashtags: savedData.hashtags || '',
          steps: savedData.steps || '',
        };
        
        setFormData(loadedData);
        lastSavedDataRef.current = JSON.stringify({ ...loadedData, id });
      }
    }
    
    hasInitializedRef.current = true;
  }, [initialData, id, isEditMode]);
  
  // Create a debounced save function
  const debouncedSave = useCallback(() => {
    if (saveTimeoutRef.current !== null) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    const save = () => {
      // Only save if there's actual data
      if (formDataRef.current.title) {
        const storageKey = getStorageKey("airdrop", isEditMode, id);
        const dataToSave = { ...formDataRef.current, id };
        const serializedData = JSON.stringify(dataToSave);
        
        // Skip if nothing has changed
        if (serializedData === lastSavedDataRef.current) {
          return;
        }
        
        saveFormData(storageKey, dataToSave);
        lastSavedDataRef.current = serializedData;
        console.log('Saved form data to localStorage', storageKey);
      }
    };
    
    // Set a timeout to save after a delay
    saveTimeoutRef.current = window.setTimeout(save, 1000);
  }, [id, isEditMode]);
  
  // Wrap setFormData to also trigger a save
  const setFormDataAndSave = useCallback((data: React.SetStateAction<NewAirdrop & { 
    meta_title?: string; 
    meta_description?: string; 
    hashtags?: string;
    steps?: string;
  }>) => {
    setFormData(data);
    // Schedule a save after the state has been updated
    setTimeout(debouncedSave, 0);
  }, [debouncedSave]);
  
  // Save form data to localStorage whenever it changes, but debounce it
  useEffect(() => {
    // Only save if there's actual data and we've initialized
    if (formData.title && hasInitializedRef.current) {
      debouncedSave();
    }
    
    // Cleanup on unmount
    return () => {
      if (saveTimeoutRef.current !== null) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [debouncedSave, formData]);

  const clearAirdropFormData = useCallback(() => {
    const storageKey = getStorageKey("airdrop", isEditMode, id);
    clearFormData(storageKey);
  }, [isEditMode, id]);

  return {
    formData,
    setFormData: setFormDataAndSave,
    clearAirdropFormData
  };
}
