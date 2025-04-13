
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe, Home, Book, FileText, Settings, Footprints, MessageSquareQuote
} from "lucide-react";
import GeneralTab from './GeneralTab';
import HomeTab from './HomeTab';
import AboutTab from './AboutTab';
import FooterTab from './FooterTab';
import LegalTab from './LegalTab';
import TestimonialsTab from './TestimonialsTab';
import { saveScrollPosition, restoreScrollPosition } from '@/lib/utils/formStorage';

interface SettingsTabsProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  updateSettings: any;
  handleSubmit: (e: React.FormEvent) => void;
}

const SettingsTabs = ({ formData, handleInputChange, updateSettings, handleSubmit }: SettingsTabsProps) => {
  // Use localStorage to remember the last active tab
  const [activeTab, setActiveTab] = React.useState(() => {
    const savedTab = localStorage.getItem('adminSettingsActiveTab');
    return savedTab || 'general';
  });

  // Handle tab switching with persistence
  const handleTabChange = (newTab: string) => {
    // Save current tab's scroll position before switching
    saveScrollPosition(`adminSettings_${activeTab}`);
    
    // Update active tab
    setActiveTab(newTab);
    
    // Store in localStorage
    localStorage.setItem('adminSettingsActiveTab', newTab);
    
    // Schedule restoration of the new tab's scroll position
    setTimeout(() => {
      restoreScrollPosition(`adminSettings_${newTab}`);
    }, 100);
  };

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('adminSettingsActiveTab', activeTab);
  }, [activeTab]);
  
  // Restore scroll position when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        restoreScrollPosition(`adminSettings_${activeTab}`);
      } else {
        saveScrollPosition(`adminSettings_${activeTab}`);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Initial scroll position restoration
    restoreScrollPosition(`adminSettings_${activeTab}`);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [activeTab]);

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="mb-8 border border-white/10 rounded-lg p-1 bg-crypto-darkBlue/50">
        <TabsTrigger value="general" className="flex items-center gap-2 data-[state=active]:bg-crypto-orange data-[state=active]:text-white">
          <Settings size={16} />
          <span>عام</span>
        </TabsTrigger>
        <TabsTrigger value="home" className="flex items-center gap-2 data-[state=active]:bg-crypto-orange data-[state=active]:text-white">
          <Home size={16} />
          <span>الصفحة الرئيسية</span>
        </TabsTrigger>
        <TabsTrigger value="about" className="flex items-center gap-2 data-[state=active]:bg-crypto-orange data-[state=active]:text-white">
          <Book size={16} />
          <span>من نحن</span>
        </TabsTrigger>
        <TabsTrigger value="testimonials" className="flex items-center gap-2 data-[state=active]:bg-crypto-orange data-[state=active]:text-white">
          <MessageSquareQuote size={16} />
          <span>آراء العملاء</span>
        </TabsTrigger>
        <TabsTrigger value="footer" className="flex items-center gap-2 data-[state=active]:bg-crypto-orange data-[state=active]:text-white">
          <Footprints size={16} />
          <span>التذييل</span>
        </TabsTrigger>
        <TabsTrigger value="legal" className="flex items-center gap-2 data-[state=active]:bg-crypto-orange data-[state=active]:text-white">
          <FileText size={16} />
          <span>القانونية</span>
        </TabsTrigger>
      </TabsList>
      
      <form onSubmit={handleSubmit} data-tab-content={activeTab}>
        <TabsContent value="general">
          <GeneralTab 
            formData={formData} 
            handleInputChange={handleInputChange} 
            updateSettings={updateSettings}
          />
        </TabsContent>
        
        <TabsContent value="home">
          <HomeTab 
            formData={formData} 
            handleInputChange={handleInputChange} 
            updateSettings={updateSettings}
          />
        </TabsContent>
        
        <TabsContent value="about">
          <AboutTab 
            formData={formData} 
            handleInputChange={handleInputChange} 
            updateSettings={updateSettings}
          />
        </TabsContent>
        
        <TabsContent value="testimonials">
          <TestimonialsTab 
            formData={formData} 
            handleInputChange={handleInputChange} 
            updateSettings={updateSettings}
          />
        </TabsContent>
        
        <TabsContent value="footer">
          <FooterTab 
            formData={formData} 
            handleInputChange={handleInputChange} 
            updateSettings={updateSettings}
          />
        </TabsContent>
        
        <TabsContent value="legal">
          <LegalTab 
            formData={formData} 
            handleInputChange={handleInputChange} 
            updateSettings={updateSettings}
          />
        </TabsContent>
      </form>
    </Tabs>
  );
};

export default SettingsTabs;
