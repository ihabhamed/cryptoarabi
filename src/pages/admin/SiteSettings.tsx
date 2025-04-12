
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { 
  Globe, Home, Book, MessageSquare, Newspaper, Settings, FileText, 
  Link as LinkIcon, FileCog, Users, PanelLeftOpen, Footprints
} from "lucide-react";
import { useSiteSettings, useUpdateSiteSettings } from '@/lib/hooks';
import AdminLayout from '@/components/admin/AdminLayout';

const SiteSettings = () => {
  const { user, loading, isAdmin } = useAuth();
  const { data: settings, isLoading: isLoadingSettings } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();
  
  const [formData, setFormData] = useState<any>({});
  
  if (loading || isLoadingSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-crypto-darkBlue">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-crypto-orange"></div>
      </div>
    );
  }
  
  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  
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
  React.useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);
  
  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">إعدادات الموقع</h1>
          <p className="text-gray-500">قم بتعديل الإعدادات العامة للموقع</p>
        </div>
        
        <Tabs defaultValue="general">
          <TabsList className="mb-8 border border-gray-200 rounded-lg p-1 bg-white">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings size={16} />
              <span>عام</span>
            </TabsTrigger>
            <TabsTrigger value="home" className="flex items-center gap-2">
              <Home size={16} />
              <span>الصفحة الرئيسية</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center gap-2">
              <Book size={16} />
              <span>من نحن</span>
            </TabsTrigger>
            <TabsTrigger value="footer" className="flex items-center gap-2">
              <Footprints size={16} />
              <span>التذييل</span>
            </TabsTrigger>
            <TabsTrigger value="legal" className="flex items-center gap-2">
              <FileText size={16} />
              <span>القانونية</span>
            </TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit}>
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>الإعدادات العامة</CardTitle>
                  <CardDescription>قم بتعديل الإعدادات العامة للموقع</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="site_name">اسم الموقع</Label>
                    <Input 
                      id="site_name" 
                      name="site_name" 
                      value={formData.site_name || ''} 
                      onChange={handleInputChange}
                      placeholder="كريبتوعرب" 
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="bg-crypto-orange hover:bg-crypto-orange/90 text-white w-full sm:w-auto"
                    disabled={updateSettings.isPending}
                  >
                    {updateSettings.isPending ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="home">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات الصفحة الرئيسية</CardTitle>
                  <CardDescription>قم بتعديل محتوى الصفحة الرئيسية</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">قسم الترحيب</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="hero_title">العنوان الرئيسي</Label>
                          <Input 
                            id="hero_title" 
                            name="hero_title"
                            value={formData.hero_title || ''} 
                            onChange={handleInputChange}
                            placeholder="مستقبل المال الرقمي يبدأ من هنا" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="hero_subtitle">العنوان الفرعي</Label>
                          <Textarea 
                            id="hero_subtitle" 
                            name="hero_subtitle"
                            value={formData.hero_subtitle || ''} 
                            onChange={handleInputChange}
                            placeholder="استكشف عالم العملات المشفرة..." 
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">أزرار الدعوة للإجراء</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cta_primary_text">نص الزر الرئيسي</Label>
                          <Input 
                            id="cta_primary_text" 
                            name="cta_primary_text"
                            value={formData.cta_primary_text || ''} 
                            onChange={handleInputChange}
                            placeholder="ابدأ رحلتك" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cta_secondary_text">نص الزر الثانوي</Label>
                          <Input 
                            id="cta_secondary_text" 
                            name="cta_secondary_text"
                            value={formData.cta_secondary_text || ''} 
                            onChange={handleInputChange}
                            placeholder="تعلم المزيد" 
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">إحصائيات الموقع</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="active_users_count">عدد المستخدمين النشطين</Label>
                          <Input 
                            id="active_users_count" 
                            name="active_users_count"
                            value={formData.active_users_count || ''} 
                            onChange={handleInputChange}
                            placeholder="+١٠٠ ألف" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="successful_projects_count">عدد المشاريع الناجحة</Label>
                          <Input 
                            id="successful_projects_count" 
                            name="successful_projects_count"
                            value={formData.successful_projects_count || ''} 
                            onChange={handleInputChange}
                            placeholder="+٥٠" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="support_hours">ساعات الدعم الفني</Label>
                          <Input 
                            id="support_hours" 
                            name="support_hours"
                            value={formData.support_hours || ''} 
                            onChange={handleInputChange}
                            placeholder="٢٤/٧" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="bg-crypto-orange hover:bg-crypto-orange/90 text-white w-full sm:w-auto"
                    disabled={updateSettings.isPending}
                  >
                    {updateSettings.isPending ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle>قسم من نحن</CardTitle>
                  <CardDescription>قم بتعديل محتوى قسم من نحن</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="about_title">عنوان قسم من نحن</Label>
                    <Input 
                      id="about_title" 
                      name="about_title"
                      value={formData.about_title || ''} 
                      onChange={handleInputChange}
                      placeholder="من نحن" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="about_content">محتوى قسم من نحن</Label>
                    <Textarea 
                      id="about_content" 
                      name="about_content"
                      value={formData.about_content || ''} 
                      onChange={handleInputChange}
                      placeholder="نحن فريق من الخبراء المتخصصين في مجال العملات المشفرة والبلوكتشين والويب 3.0..." 
                      rows={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="about_image_url">رابط صورة قسم من نحن</Label>
                    <Input 
                      id="about_image_url" 
                      name="about_image_url"
                      value={formData.about_image_url || ''} 
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg" 
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="bg-crypto-orange hover:bg-crypto-orange/90 text-white w-full sm:w-auto"
                    disabled={updateSettings.isPending}
                  >
                    {updateSettings.isPending ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="footer">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات التذييل</CardTitle>
                  <CardDescription>قم بتعديل محتوى تذييل الموقع</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="footer_description">وصف التذييل</Label>
                    <Textarea 
                      id="footer_description" 
                      name="footer_description"
                      value={formData.footer_description || ''} 
                      onChange={handleInputChange}
                      placeholder="منصة عربية متخصصة في تقديم المعلومات والخدمات في مجال العملات المشفرة والبلوكتشين والويب 3.0" 
                      rows={3}
                    />
                  </div>
                  
                  <div className="mt-4">
                    <p className="mb-2">لتعديل روابط التذييل والروابط الاجتماعية، يرجى استخدام صفحة إدارة الروابط.</p>
                    <Button 
                      type="button" 
                      className="bg-crypto-orange hover:bg-crypto-orange/90 text-white"
                      onClick={() => window.location.href = '/admin/links'}
                    >
                      إدارة الروابط
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="bg-crypto-orange hover:bg-crypto-orange/90 text-white w-full sm:w-auto"
                    disabled={updateSettings.isPending}
                  >
                    {updateSettings.isPending ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="legal">
              <Card>
                <CardHeader>
                  <CardTitle>الصفحات القانونية</CardTitle>
                  <CardDescription>قم بتعديل محتوى الصفحات القانونية</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="privacy_policy">سياسة الخصوصية</Label>
                    <Textarea 
                      id="privacy_policy" 
                      name="privacy_policy"
                      value={formData.privacy_policy || ''} 
                      onChange={handleInputChange}
                      placeholder="أدخل محتوى سياسة الخصوصية هنا..." 
                      rows={10}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="terms_conditions">الشروط والأحكام</Label>
                    <Textarea 
                      id="terms_conditions" 
                      name="terms_conditions"
                      value={formData.terms_conditions || ''} 
                      onChange={handleInputChange}
                      placeholder="أدخل محتوى الشروط والأحكام هنا..." 
                      rows={10}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="bg-crypto-orange hover:bg-crypto-orange/90 text-white w-full sm:w-auto"
                    disabled={updateSettings.isPending}
                  >
                    {updateSettings.isPending ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </form>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SiteSettings;
