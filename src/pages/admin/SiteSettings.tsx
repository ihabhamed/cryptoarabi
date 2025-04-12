
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import SettingsTabs from '@/components/admin/site-settings/SettingsTabs';
import { useSiteSettings, useUpdateSiteSettings } from '@/lib/hooks';

const SiteSettings = () => {
  const { user, loading, isAdmin } = useAuth();
  const { data: settings, isLoading: isLoadingSettings } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();
  
  const [formData, setFormData] = useState<any>({});
  
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    
    const updatedSettings = {
      id: settings.id,
      ...formData
    };
    
    updateSettings.mutate(updatedSettings);
  };
  
  // Initialize form data with current settings
  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);
  
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
