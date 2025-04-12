
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe, Home, Book, FileText, Settings, Footprints
} from "lucide-react";
import GeneralTab from './GeneralTab';
import HomeTab from './HomeTab';
import AboutTab from './AboutTab';
import FooterTab from './FooterTab';
import LegalTab from './LegalTab';

interface SettingsTabsProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  updateSettings: any;
  handleSubmit: (e: React.FormEvent) => void;
}

const SettingsTabs = ({ formData, handleInputChange, updateSettings, handleSubmit }: SettingsTabsProps) => {
  return (
    <Tabs defaultValue="general">
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
        <TabsTrigger value="footer" className="flex items-center gap-2 data-[state=active]:bg-crypto-orange data-[state=active]:text-white">
          <Footprints size={16} />
          <span>التذييل</span>
        </TabsTrigger>
        <TabsTrigger value="legal" className="flex items-center gap-2 data-[state=active]:bg-crypto-orange data-[state=active]:text-white">
          <FileText size={16} />
          <span>القانونية</span>
        </TabsTrigger>
      </TabsList>
      
      <form onSubmit={handleSubmit}>
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
