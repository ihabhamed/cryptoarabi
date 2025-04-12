
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link2, Link } from "lucide-react";
import AdminLayout from '@/components/admin/AdminLayout';
import FooterLinksTab from '@/components/admin/links/FooterLinksTab';
import SocialLinksTab from '@/components/admin/links/SocialLinksTab';

// Key for storing the active tab in localStorage
const ACTIVE_TAB_STORAGE_KEY = 'admin_links_active_tab';

const ManageLinks = () => {
  const { user, loading, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(() => {
    // Try to get the saved tab from localStorage on initial load
    const savedTab = localStorage.getItem(ACTIVE_TAB_STORAGE_KEY);
    return savedTab || 'footer'; // Default to 'footer' if no saved tab
  });
  
  // Update localStorage when active tab changes
  useEffect(() => {
    localStorage.setItem(ACTIVE_TAB_STORAGE_KEY, activeTab);
  }, [activeTab]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-crypto-darkBlue">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-crypto-orange"></div>
      </div>
    );
  }
  
  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return (
    <AdminLayout>
      <div dir="rtl" className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">إدارة الروابط</h1>
          <p className="text-gray-400">قم بإدارة روابط التذييل والروابط الاجتماعية</p>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="mb-8 border border-white/10 rounded-lg p-1 bg-crypto-darkGray/80 backdrop-blur-md">
            <TabsTrigger value="footer" className="flex items-center gap-2 data-[state=active]:bg-crypto-orange/20 data-[state=active]:text-crypto-orange">
              <Link2 size={16} />
              <span>روابط التذييل</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2 data-[state=active]:bg-crypto-orange/20 data-[state=active]:text-crypto-orange">
              <Link size={16} />
              <span>روابط التواصل الاجتماعي</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="footer">
            <FooterLinksTab />
          </TabsContent>
          
          <TabsContent value="social">
            <SocialLinksTab />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ManageLinks;
