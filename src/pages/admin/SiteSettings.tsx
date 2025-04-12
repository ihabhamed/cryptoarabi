
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import SettingsTabs from '@/components/admin/site-settings/SettingsTabs';
import { useSiteSettings, useUpdateSiteSettings } from '@/lib/hooks';
import { toast } from '@/hooks/use-toast';

const SiteSettings = () => {
  const { user, loading, isAdmin } = useAuth();
  const { data: settings, isLoading: isLoadingSettings, isError } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();
  
  const [formData, setFormData] = useState<any>({});
  
  // Initialize form data with current settings whenever they change
  useEffect(() => {
    if (settings) {
      console.log('Settings loaded, updating form data', settings);
      setFormData(settings);
      
      // Save to localStorage as a backup
      localStorage.setItem('siteSettingsFormData', JSON.stringify(settings));
    }
  }, [settings]);
  
  // Try to load from localStorage if no settings yet
  useEffect(() => {
    if (!settings && !isLoadingSettings) {
      const savedData = localStorage.getItem('siteSettingsFormData');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          console.log('Loading settings from localStorage');
          setFormData(parsedData);
        } catch (error) {
          console.error('Error parsing saved settings:', error);
        }
      }
    }
  }, [settings, isLoadingSettings]);
  
  // Show error message if settings failed to load
  useEffect(() => {
    if (isError) {
      toast({
        variant: "destructive",
        title: "خطأ في التحميل",
        description: "فشل في تحميل إعدادات الموقع. يرجى تحديث الصفحة.",
      });
    }
  }, [isError]);
  
  // Loading state
  if (loading || isLoadingSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-crypto-darkBlue">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-crypto-orange"></div>
      </div>
    );
  }
  
  // Auth check
  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  
  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    
    // Save to localStorage while editing
    localStorage.setItem('siteSettingsFormData', JSON.stringify(updatedFormData));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id && settings) {
      // Ensure we have the ID from settings
      setFormData(prev => ({ ...prev, id: settings.id }));
    }
    
    const updatedSettings = {
      ...(settings ? { id: settings.id } : {}),
      ...formData
    };
    
    updateSettings.mutate(updatedSettings);
  };
  
  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">إعدادات الموقع</h1>
          <p className="text-gray-400">قم بتعديل الإعدادات العامة للموقع</p>
        </div>
        
        <SettingsTabs 
          formData={formData}
          handleInputChange={handleInputChange}
          updateSettings={updateSettings}
          handleSubmit={handleSubmit}
        />
      </div>
    </AdminLayout>
  );
};

export default SiteSettings;
