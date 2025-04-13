
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from '@/components/admin/AdminLayout';
import AirdropTab from '@/components/admin/dashboard/AirdropTab';
import BlogTab from '@/components/admin/dashboard/BlogTab';
import ServicesTab from '@/components/admin/dashboard/ServicesTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTabState } from '@/hooks/useTabState';

const Dashboard = () => {
  const { activeTab, handleTabChange } = useTabState('admin_dashboard_active_tab', 'airdrops');
  
  // Save form data states for each tab when switching
  const handleTabSwitch = (newTab: string) => {
    // Before changing tabs, make sure to force save any form data currently in the DOM to localStorage
    if (activeTab === 'blog') {
      const blogFormData = document.querySelector('form[data-tab="blog"]');
      if (blogFormData) {
        // Trigger form save event for blog tab
        const event = new Event('forcesave', { bubbles: true });
        blogFormData.dispatchEvent(event);
      }
    } else if (activeTab === 'airdrops') {
      const airdropFormData = document.querySelector('form[data-tab="airdrops"]');
      if (airdropFormData) {
        // Trigger form save event for airdrop tab
        const event = new Event('forcesave', { bubbles: true });
        airdropFormData.dispatchEvent(event);
      }
    } else if (activeTab === 'services') {
      const servicesFormData = document.querySelector('form[data-tab="services"]');
      if (servicesFormData) {
        // Trigger form save event for services tab
        const event = new Event('forcesave', { bubbles: true });
        servicesFormData.dispatchEvent(event);
      }
    }
    
    // Change the tab
    handleTabChange(newTab);
  };
  
  return (
    <AdminLayout>
      <main className="container mx-auto py-8 px-4">
        <Card className="mb-8 bg-crypto-darkGray/80 backdrop-blur-md border border-white/10 text-white shadow-lg">
          <CardHeader className="border-b border-white/10 pb-4">
            <CardTitle className="text-2xl font-bold text-crypto-orange">لوحة التحكم</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs 
              value={activeTab} 
              onValueChange={handleTabSwitch} 
              className="w-full"
            >
              <TabsList className="mb-6 w-full bg-crypto-darkBlue/50 p-1">
                <TabsTrigger value="airdrops" className="data-[state=active]:bg-crypto-orange data-[state=active]:text-white">الإيردروب</TabsTrigger>
                <TabsTrigger value="blog" className="data-[state=active]:bg-crypto-orange data-[state=active]:text-white">المدونة</TabsTrigger>
                <TabsTrigger value="services" className="data-[state=active]:bg-crypto-orange data-[state=active]:text-white">الخدمات</TabsTrigger>
              </TabsList>
              
              <TabsContent value="airdrops" className="space-y-6 min-h-[400px]">
                <AirdropTab />
              </TabsContent>
              
              <TabsContent value="blog" className="space-y-6 min-h-[400px]">
                <BlogTab />
              </TabsContent>
              
              <TabsContent value="services" className="space-y-6 min-h-[400px]">
                <ServicesTab />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </AdminLayout>
  );
};

export default Dashboard;
