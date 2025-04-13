
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return {
    handleChange,
    handleSelectChange
  };
}
