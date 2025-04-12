
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LegalPages = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">الصفحات القانونية</h1>
          <p className="text-gray-400">إدارة وتعديل الصفحات القانونية للموقع</p>
        </div>
        
        <Card className="bg-crypto-darkGray/80 backdrop-blur-md border border-white/10 text-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-crypto-orange">الصفحات القانونية</CardTitle>
          </CardHeader>
          <CardContent>
            <p>محتوى الصفحات القانونية سيظهر هنا</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default LegalPages;
