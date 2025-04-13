
import { useCallback } from 'react';
import { NewAirdrop } from '@/types/airdrop';

type FormSetter = React.Dispatch<React.SetStateAction<NewAirdrop & { 
  meta_title?: string; 
  meta_description?: string; 
  hashtags?: string;
  steps?: string;
}>>;

/**
 * Hook for managing airdrop form input handlers
 */
export function useAirdropFormHandlers(setFormData: FormSetter) {
  // Handle text input changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Use functional update to avoid race conditions
    setFormData(prevData => {
      // Only update if the value has actually changed
      if (prevData[name as keyof typeof prevData] === value) {
        return prevData;
      }
      
      // Create a completely new object to ensure React detects the change
      return { 
        ...prevData, 
        [name]: value 
      };
    });
  }, [setFormData]);
  
  // Handle select changes
  const handleSelectChange = useCallback((name: string, value: string) => {
    // Use functional update to avoid race conditions
    setFormData(prevData => {
      // Only update if the value has actually changed
      if (prevData[name as keyof typeof prevData] === value) {
        return prevData;
      }
      
      // Create a completely new object to ensure React detects the change
      return { 
        ...prevData, 
        [name]: value 
      };
    });
  }, [setFormData]);

  return {
    handleChange,
    handleSelectChange
  };
}
