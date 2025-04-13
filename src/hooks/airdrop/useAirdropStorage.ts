
import { useState, useEffect, useRef, useCallback } from 'react';
import { NewAirdrop } from '@/types/airdrop';
import { saveFormData, getFormData, getStorageKey, clearFormData } from '@/lib/utils/formStorage';
import { toast } from '@/lib/utils/toast-utils';

interface UseAirdropStorageProps {
  id?: string;
  isEditMode: boolean;
  initialData?: NewAirdrop & { 
    meta_title?: string; 
    meta_description?: string;
    hashtags?: string;
    steps?: string;
  };
  forceUpdate?: number; // Add the forceUpdate property
  dataReady?: boolean; // Add flag to indicate when API data is ready
}

/**
 * Hook for managing airdrop form data persistence in localStorage
 */
export function useAirdropStorage({ id, isEditMode, initialData, forceUpdate = 0, dataReady = false }: UseAirdropStorageProps) {
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
  // DEBUG flag
  const DEBUG = true;

  // Update the ref whenever formData changes
  useEffect(() => {
    formDataRef.current = formData;
    if (DEBUG) console.log('Form data updated:', formData);
  }, [formData]);

  // Load data from localStorage or initial data when API data is ready
  useEffect(() => {
    // Skip if we've already initialized or (in edit mode) if data isn't ready yet
    if (hasInitializedRef.current || (isEditMode && !dataReady && !initialData)) {
      return;
    }
    
    const storageKey = getStorageKey("airdrop", isEditMode, id);
    
    if (DEBUG) console.log('Initial load with key:', storageKey, 'isEditMode:', isEditMode, 'id:', id, 'dataReady:', dataReady);
    
    if (initialData && Object.keys(initialData).length > 0) {
      if (DEBUG) console.log('Loading from initialData:', initialData);
      
      // Set initial data
      setFormData({
        ...initialData,
        meta_title: initialData.meta_title || initialData.title || '',
        meta_description: initialData.meta_description || initialData.description || '',
        hashtags: initialData.hashtags || '',
        steps: initialData.steps || '',
      });
      
      // Save to localStorage with unique key
      saveFormData(storageKey, { ...initialData, id });
      lastSavedDataRef.current = JSON.stringify({ ...initialData, id });
      
      if (DEBUG) console.log('Saved initial data to localStorage:', storageKey);
      
      // Show confirmation toast
      toast({
        title: "تم تحميل البيانات",
        description: "تم تحميل بيانات الإيردروب بنجاح",
      });
      
      hasInitializedRef.current = true;
    } else {
      // For new entry or edit mode without initialData, check localStorage
      const savedData = getFormData<NewAirdrop & { 
        id?: string; 
        meta_title?: string; 
        meta_description?: string;
        hashtags?: string;
        steps?: string;
      }>(storageKey);
      
      if (savedData) {
        if (DEBUG) console.log('Loading from localStorage:', savedData);
        
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
        
        // Show confirmation toast if in edit mode
        if (isEditMode) {
          toast({
            title: "تم تحميل البيانات المحفوظة",
            description: "تم استعادة بيانات الإيردروب من الجلسة السابقة",
          });
        }
        
        hasInitializedRef.current = true;
      } else if (DEBUG) {
        console.log('No data found in localStorage for key:', storageKey);
      }
    }
  }, [initialData, id, isEditMode, dataReady]);
  
  // Effect specifically for handling changes in dataReady state
  useEffect(() => {
    if (dataReady && isEditMode && initialData && Object.keys(initialData).length > 0) {
      if (DEBUG) console.log('Data ready flag changed to true, setting data from API:', initialData);
      
      // Set data from API
      setFormData({
        ...initialData,
        meta_title: initialData.meta_title || initialData.title || '',
        meta_description: initialData.meta_description || initialData.description || '',
        hashtags: initialData.hashtags || '',
        steps: initialData.steps || '',
      });
      
      hasInitializedRef.current = true;
    }
  }, [dataReady, initialData, isEditMode]);
  
  // Add effect to respond to forceUpdate changes
  useEffect(() => {
    if (forceUpdate > 0 && hasInitializedRef.current) {
      if (DEBUG) console.log('Force update triggered in storage hook:', forceUpdate);
      
      // Re-fetch data from localStorage
      const storageKey = getStorageKey("airdrop", isEditMode, id);
      const savedData = getFormData<NewAirdrop & { 
        id?: string; 
        meta_title?: string; 
        meta_description?: string;
        hashtags?: string;
        steps?: string;
      }>(storageKey);
      
      if (savedData) {
        if (DEBUG) console.log('Reloading data from localStorage due to force update:', savedData);
        
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
  }, [forceUpdate, id, isEditMode]);
  
  // Create a debounced save function
  const debouncedSave = useCallback(() => {
    if (saveTimeoutRef.current !== null) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    const save = () => {
      const dataToSave = { ...formDataRef.current, id };
      const serializedData = JSON.stringify(dataToSave);
      
      // Skip if nothing has changed
      if (serializedData === lastSavedDataRef.current) {
        if (DEBUG) console.log('No changes to save');
        return;
      }
      
      const storageKey = getStorageKey("airdrop", isEditMode, id);
      saveFormData(storageKey, dataToSave);
      lastSavedDataRef.current = serializedData;
      
      if (DEBUG) console.log('Saved form data to localStorage:', storageKey, dataToSave);
    };
    
    // Set a timeout to save after a delay
    saveTimeoutRef.current = window.setTimeout(save, 300);
  }, [id, isEditMode]);
  
  // Wrap setFormData to also trigger a save
  const setFormDataAndSave = useCallback((data: React.SetStateAction<NewAirdrop & { 
    meta_title?: string; 
    meta_description?: string; 
    hashtags?: string;
    steps?: string;
  }>) => {
    setFormData(prev => {
      // Handle functional updates
      const newData = typeof data === 'function' ? data(prev) : data;
      
      if (DEBUG) console.log('Setting form data:', newData);
      
      // Return the new state
      return newData;
    });
    
    // Schedule a save after the state has been updated
    setTimeout(debouncedSave, 10);
  }, [debouncedSave]);
  
  // Save form data to localStorage whenever it changes
  useEffect(() => {
    // Only save if we've initialized
    if (hasInitializedRef.current) {
      debouncedSave();
    }
    
    // Cleanup on unmount
    return () => {
      if (saveTimeoutRef.current !== null) {
        clearTimeout(saveTimeoutRef.current);
        
        // Force a final save on unmount
        const storageKey = getStorageKey("airdrop", isEditMode, id);
        saveFormData(storageKey, { ...formDataRef.current, id });
        
        if (DEBUG) console.log('Final save on unmount:', storageKey);
      }
    };
  }, [debouncedSave, formData, id, isEditMode]);

  const clearAirdropFormData = useCallback(() => {
    const storageKey = getStorageKey("airdrop", isEditMode, id);
    clearFormData(storageKey);
    
    if (DEBUG) console.log('Cleared form data:', storageKey);
  }, [isEditMode, id]);

  return {
    formData,
    setFormData: setFormDataAndSave,
    clearAirdropFormData
  };
}
