
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ServicesTab from '@/components/admin/dashboard/ServicesTab';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminServices = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">إدارة الخدمات</h1>
          <p className="text-gray-400">قم بإدارة وتعديل الخدمات المقدمة</p>
        </div>
        
        <Card className="bg-crypto-darkGray/80 backdrop-blur-md border border-white/10 text-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-crypto-orange">خدمات الموقع</CardTitle>
          </CardHeader>
          <CardContent>
            <ServicesTab />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminServices;
