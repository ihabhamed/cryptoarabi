
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AirdropTab from '@/components/admin/dashboard/AirdropTab';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminAirdrops = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">إدارة الإيردروب</h1>
          <p className="text-gray-400">قم بإدارة وتعديل كافة الإيردروبات المتاحة</p>
        </div>
        
        <Card className="bg-crypto-darkGray/80 backdrop-blur-md border border-white/10 text-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-crypto-orange">قائمة الإيردروبات</CardTitle>
          </CardHeader>
          <CardContent>
            <AirdropTab />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAirdrops;
