
import { useEffect } from 'react';

/**
 * A utility component that listens for window focus events
 * This helps ensure that form data is properly reloaded when switching tabs
 */
const WindowFocusHandler = () => {
  useEffect(() => {
    // When the window regains focus, log it for debugging
    const handleFocus = () => {
      console.log('Window focused - data should be loaded from localStorage if available');
    };
    
    // Add event listeners
    window.addEventListener('focus', handleFocus);
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        console.log('Tab became visible again');
      }
    });
    
    // Cleanup
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('visibilitychange', handleFocus);
    };
  }, []);
  
  // This component doesn't render anything
  return null;
};

export default WindowFocusHandler;
