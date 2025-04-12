
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAirdrops, useBlogPosts, useServices } from '@/lib/supabase-hooks';

const Admin = () => {
  const { data: airdrops, isLoading: isLoadingAirdrops } = useAirdrops();
  const { data: blogPosts, isLoading: isLoadingBlogPosts } = useBlogPosts();
  const { data: services, isLoading: isLoadingServices } = useServices();

  return (
    <div className="container mx-auto py-32 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">لوحة التحكم</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="airdrops">
            <TabsList className="mb-4">
              <TabsTrigger value="airdrops">الإيردروب</TabsTrigger>
              <TabsTrigger value="blog">المدونة</TabsTrigger>
              <TabsTrigger value="services">الخدمات</TabsTrigger>
            </TabsList>
            
            <TabsContent value="airdrops">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">إدارة الإيردروب</h3>
                  <Button>إضافة إيردروب جديد</Button>
                </div>
                
                {isLoadingAirdrops ? (
                  <p>جاري التحميل...</p>
                ) : (
                  <div className="grid gap-4">
                    {airdrops?.map((airdrop) => (
                      <Card key={airdrop.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">{airdrop.title}</h4>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">تعديل</Button>
                              <Button variant="destructive" size="sm">حذف</Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            الحالة: {airdrop.status}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="blog">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">إدارة المدونة</h3>
                  <Button>إضافة منشور جديد</Button>
                </div>
                
                {isLoadingBlogPosts ? (
                  <p>جاري التحميل...</p>
                ) : (
                  <div className="grid gap-4">
                    {blogPosts?.map((post) => (
                      <Card key={post.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">{post.title}</h4>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">تعديل</Button>
                              <Button variant="destructive" size="sm">حذف</Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            بواسطة: {post.author || 'غير معروف'}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="services">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">إدارة الخدمات</h3>
                  <Button>إضافة خدمة جديدة</Button>
                </div>
                
                {isLoadingServices ? (
                  <p>جاري التحميل...</p>
                ) : (
                  <div className="grid gap-4">
                    {services?.map((service) => (
                      <Card key={service.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">{service.title}</h4>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">تعديل</Button>
                              <Button variant="destructive" size="sm">حذف</Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {service.description || 'لا يوجد وصف'}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
