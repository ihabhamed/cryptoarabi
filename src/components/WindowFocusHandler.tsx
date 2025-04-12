
import { useEffect } from 'react';
import { useSiteSettings } from '@/lib/hooks';

/**
 * A utility component that listens for window focus events
 * This helps ensure that form data is properly reloaded when switching tabs
 */
const WindowFocusHandler = () => {
  const { refetch } = useSiteSettings();
  
  useEffect(() => {
    // When the window regains focus, refetch data to ensure it's up to date
    const handleFocus = () => {
      console.log('Window focused - data should be loaded from localStorage if available');
      // Only refetch if we're on the site settings page
      if (window.location.pathname.includes('/admin/site-settings')) {
        console.log('Refetching site settings on focus');
        refetch();
      }
    };
    
    // Handle tab visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Tab became visible again');
        // Only refetch if we're on the site settings page
        if (window.location.pathname.includes('/admin/site-settings')) {
          console.log('Refetching site settings on visibility change');
          refetch();
        }
      }
    };
    
    // Add event listeners
    window.addEventListener('focus', handleFocus);
    window.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refetch]);
  
  // This component doesn't render anything
  return null;
};

export default WindowFocusHandler;
