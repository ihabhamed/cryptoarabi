
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";

const AdminBackup = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">النسخ الاحتياطي</h1>
          <p className="text-gray-400">إدارة النسخ الاحتياطية لقاعدة البيانات</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-crypto-darkGray/80 backdrop-blur-md border border-white/10 text-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-crypto-orange">إنشاء نسخة احتياطية</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">قم بإنشاء نسخة احتياطية كاملة من قاعدة البيانات</p>
              <Button className="bg-crypto-orange hover:bg-crypto-orange/90 text-white">
                <Download className="h-4 w-4 ml-2" />
                تنزيل نسخة احتياطية
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-crypto-darkGray/80 backdrop-blur-md border border-white/10 text-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-crypto-orange">استعادة من نسخة احتياطية</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">قم باستعادة قاعدة البيانات من نسخة احتياطية سابقة</p>
              <Button variant="outline" className="border-crypto-orange text-crypto-orange hover:bg-crypto-orange/10">
                <Upload className="h-4 w-4 ml-2" />
                استعادة نسخة احتياطية
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBackup;
