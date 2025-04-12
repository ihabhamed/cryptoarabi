
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link2, Link } from "lucide-react";
import AdminLayout from '@/components/admin/AdminLayout';
import FooterLinksTab from '@/components/admin/links/FooterLinksTab';
import SocialLinksTab from '@/components/admin/links/SocialLinksTab';

const ManageLinks = () => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get tab from URL or localStorage
  const getInitialTab = () => {
    // Check URL search params first
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    
    if (tabParam === 'footer' || tabParam === 'social') {
      return tabParam;
    }
    
    // Fall back to localStorage
    const savedTab = localStorage.getItem('manageLinksActiveTab');
    return savedTab === 'social' ? 'social' : 'footer';
  };
  
  const [activeTab, setActiveTab] = React.useState(getInitialTab);
  
  // Update localStorage and URL when tab changes
  useEffect(() => {
    localStorage.setItem('manageLinksActiveTab', activeTab);
    
    // Update URL without full page reload
    const params = new URLSearchParams(location.search);
    params.set('tab', activeTab);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }, [activeTab, location.pathname, location.search, navigate]);
  
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
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  return (
    <AdminLayout>
      <div dir="rtl" className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">إدارة الروابط</h1>
          <p className="text-gray-400">قم بإدارة روابط التذييل والروابط الاجتماعية</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
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
