
import { useState, useEffect } from 'react';
import { NewAirdrop } from '@/types/supabase';
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

  // Load data from localStorage or initial data
  useEffect(() => {
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
      
      // Save to localStorage with unique key
      saveFormData(storageKey, { ...initialData, id });
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
        setFormData({
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
        });
      }
    }
  }, [initialData, id, isEditMode]);
  
  // Save form data to localStorage whenever it changes
  useEffect(() => {
    // Only save if there's actual data
    if (formData.title) {
      const storageKey = getStorageKey("airdrop", isEditMode, id);
      saveFormData(storageKey, { ...formData, id });
    }
  }, [formData, id, isEditMode]);

  const clearAirdropFormData = () => {
    const storageKey = getStorageKey("airdrop", isEditMode, id);
    clearFormData(storageKey);
  };

  return {
    formData,
    setFormData,
    clearAirdropFormData
  };
}
