
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import BlogTab from '@/components/admin/dashboard/BlogTab';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const AdminBlog = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">إدارة المدونة</h1>
          <p className="text-gray-400">قم بإدارة وتعديل مقالات المدونة</p>
        </div>
        
        <Card className="bg-crypto-darkGray/80 backdrop-blur-md border border-white/10 text-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-crypto-orange">مقالات المدونة</CardTitle>
            <CardDescription className="text-gray-300">
              يتم توليد عنوان ووصف الميتا تلقائيًا باستخدام Google Gemini API. يمكنك تعديلها يدويًا إذا رغبت في ذلك.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BlogTab />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminBlog;
