
import { useState, useEffect } from 'react';

/**
 * A custom hook for managing tab state with persistence
 * 
 * @param storageKey - The key to use for localStorage
 * @param defaultTab - The default tab to use if no saved tab exists
 * @returns The current tab state and a function to update it
 */
export function useTabState(storageKey: string, defaultTab: string) {
  const [activeTab, setActiveTab] = useState<string>(() => {
    // Try to get the saved tab from localStorage on initial load
    const savedTab = localStorage.getItem(storageKey);
    return savedTab || defaultTab;
  });
  
  // Update localStorage when active tab changes
  useEffect(() => {
    localStorage.setItem(storageKey, activeTab);
  }, [activeTab, storageKey]);

  // Save scroll position when switching tabs
  const handleTabChange = (newTab: string) => {
    // Store current scroll position for the current tab
    localStorage.setItem(`${storageKey}_${activeTab}_scrollPos`, window.scrollY.toString());
    
    // Update the active tab
    setActiveTab(newTab);
    
    // Set timeout to restore scroll position for the new tab
    setTimeout(() => {
      const savedPos = localStorage.getItem(`${storageKey}_${newTab}_scrollPos`);
      if (savedPos) {
        window.scrollTo(0, parseInt(savedPos, 10));
      }
    }, 100);
  };

  // Restore scroll position when component mounts
  useEffect(() => {
    const savedPos = localStorage.getItem(`${storageKey}_${activeTab}_scrollPos`);
    if (savedPos) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedPos, 10));
      }, 100);
    }
  }, [activeTab, storageKey]);

  return { activeTab, handleTabChange };
}
