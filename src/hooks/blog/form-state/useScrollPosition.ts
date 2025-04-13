
import { useRef, useEffect } from 'react';

interface UseScrollPositionProps {
  storageKey: string;
}

/**
 * Hook to manage scroll position persistence
 */
export function useScrollPosition({ storageKey }: UseScrollPositionProps) {
  const scrollPositionRef = useRef<number>(0);

  // Save scroll position when component loses focus or tab is switched
  useEffect(() => {
    const saveScrollPosition = () => {
      scrollPositionRef.current = window.scrollY;
      localStorage.setItem(`${storageKey}_scrollPos`, scrollPositionRef.current.toString());
    };

    // Save when window/tab loses focus
    window.addEventListener('blur', saveScrollPosition);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        saveScrollPosition();
      }
    });

    // Also add a listener for the custom 'forcesave' event
    const handleForceSave = () => {
      saveScrollPosition();
    };
    
    document.addEventListener('forcesave', handleForceSave);

    return () => {
      window.removeEventListener('blur', saveScrollPosition);
      document.removeEventListener('visibilitychange', saveScrollPosition);
      document.removeEventListener('forcesave', handleForceSave);
    };
  }, [storageKey]);

  // Restore scroll position when component regains focus
  useEffect(() => {
    const restoreScrollPosition = () => {
      // Try to get saved position from localStorage first
      const savedPos = localStorage.getItem(`${storageKey}_scrollPos`);
      
      if (savedPos) {
        const parsedPos = parseInt(savedPos, 10);
        scrollPositionRef.current = parsedPos;
        
        setTimeout(() => {
          window.scrollTo(0, parsedPos);
        }, 100);
      } else if (scrollPositionRef.current > 0) {
        // Fallback to ref if localStorage doesn't have the value
        setTimeout(() => {
          window.scrollTo(0, scrollPositionRef.current);
        }, 100);
      }
    };

    // Restore when window/tab regains focus
    window.addEventListener('focus', restoreScrollPosition);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        restoreScrollPosition();
      }
    });

    // Initial restoration when component mounts
    restoreScrollPosition();

    return () => {
      window.removeEventListener('focus', restoreScrollPosition);
      document.removeEventListener('visibilitychange', restoreScrollPosition);
    };
  }, [storageKey]);

  return { scrollPositionRef };
}
