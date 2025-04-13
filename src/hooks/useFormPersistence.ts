
import { useEffect } from 'react';
import { saveScrollPosition, restoreScrollPosition } from '@/lib/utils/formStorage';

/**
 * Hook to handle form persistence across tab switches
 * 
 * @param formId - Unique identifier for the form
 * @param formData - The form data to persist
 * @param saveFormCallback - Function to call to save form data
 */
export function useFormPersistence(
  formId: string, 
  formData: any, 
  saveFormCallback: () => void
) {
  // Handle tab/window visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      // When hiding the tab/window, save the current state
      if (document.hidden) {
        console.log(`Tab/window hidden, saving form state for ${formId}`);
        saveFormCallback();
        saveScrollPosition(formId);
      } 
      // When showing the tab/window, restore the saved state
      else {
        console.log(`Tab/window visible, restoring state for ${formId}`);
        restoreScrollPosition(formId);
      }
    };
    
    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', () => {
      console.log(`Window blur, saving form state for ${formId}`);
      saveFormCallback();
      saveScrollPosition(formId);
    });
    window.addEventListener('focus', () => {
      console.log(`Window focus, restoring state for ${formId}`);
      restoreScrollPosition(formId);
    });
    
    // On mount, restore the scroll position
    restoreScrollPosition(formId);
    
    // Clean up
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', () => {});
      window.removeEventListener('focus', () => {});
    };
  }, [formId, formData, saveFormCallback]);
}
