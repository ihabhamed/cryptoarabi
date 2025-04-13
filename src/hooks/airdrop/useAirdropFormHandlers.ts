
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Use functional update to avoid race conditions
    setFormData(prevData => {
      // Prevent losing other state values by creating a new object with all previous data
      return { ...prevData, [name]: value };
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    // Use functional update to avoid race conditions
    setFormData(prevData => {
      return { ...prevData, [name]: value };
    });
  };

  return {
    handleChange,
    handleSelectChange
  };
}
