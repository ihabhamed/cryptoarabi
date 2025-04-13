
import { useEffect } from 'react';
import { useSiteSettings } from '@/lib/hooks';
import { useLocation } from 'react-router-dom';

/**
 * A utility component that listens for window focus events
 * This helps ensure that form data is properly reloaded when switching tabs
 */
const WindowFocusHandler = () => {
  const { refetch } = useSiteSettings();
  const location = useLocation();
  
  useEffect(() => {
    // When the window regains focus, refetch data to ensure it's up to date
    const handleFocus = () => {
      console.log('Window focused - data should be loaded from localStorage if available');
      
      try {
        // Only refetch if we're on the site settings page
        if (location.pathname.includes('/admin/site-settings')) {
          console.log('Refetching site settings on focus');
          refetch().catch(err => {
            console.error('Error refetching site settings:', err);
          });
        }
        
        // Force rerender of the form data for airdrop edit pages
        if (location.pathname.includes('/admin/airdrops/edit')) {
          console.log('Triggering airdrop form data reload on focus');
          // Force a rerender by dispatching a custom event
          window.dispatchEvent(new CustomEvent('airdrop-form-refresh'));
        }
      } catch (error) {
        console.error('Error in focus handler:', error);
      }
    };
    
    // Handle tab visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Tab became visible again');
        
        try {
          // Only refetch if we're on the site settings page
          if (location.pathname.includes('/admin/site-settings')) {
            console.log('Refetching site settings on visibility change');
            refetch().catch(err => {
              console.error('Error refetching site settings:', err);
            });
          }
          
          // Force rerender of the form data for airdrop edit pages
          if (location.pathname.includes('/admin/airdrops/edit')) {
            console.log('Triggering airdrop form data reload on visibility change');
            // Force a rerender by dispatching a custom event
            window.dispatchEvent(new CustomEvent('airdrop-form-refresh'));
          }
        } catch (error) {
          console.error('Error in visibility change handler:', error);
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
  }, [refetch, location.pathname]);
  
  // This component doesn't render anything
  return null;
};

export default WindowFocusHandler;
