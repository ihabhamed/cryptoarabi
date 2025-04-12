
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from '@/types/supabase';

const AdminBlogForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    category: '',
    slug: '',
    image_url: '',
    publish_date: new Date().toISOString()
  });
  
  useEffect(() => {
    const fetchBlogPost = async () => {
      if (isEditMode && id) {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('id', id)
            .single();
          
          if (error) throw error;
          
          if (data) {
            setFormData({
              title: data.title,
              content: data.content,
              excerpt: data.excerpt || '',
              author: data.author || '',
              category: data.category || '',
              slug: data.slug || '',
              image_url: data.image_url || '',
              publish_date: data.publish_date
            });
          }
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "خطأ في جلب البيانات",
            description: error.message || "حدث خطأ أثناء محاولة جلب بيانات المنشور",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchBlogPost();
  }, [id, isEditMode, toast]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const generateSlug = () => {
    if (formData.title) {
      // Generate slug from title - remove special chars, replace spaces with dashes, lowercase
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      
      setFormData(prev => ({ ...prev, slug }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      if (!formData.slug && formData.title) {
        generateSlug();
      }
      
      if (isEditMode && id) {
        const { error } = await supabase
          .from('blog_posts')
          .update(formData)
          .eq('id', id);
        
        if (error) throw error;
        
        toast({
          title: "تم التحديث بنجاح",
          description: "تم تحديث المنشور بنجاح",
        });
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert(formData);
        
        if (error) throw error;
        
        toast({
          title: "تمت الإضافة بنجاح",
          description: "تم إضافة المنشور بنجاح",
        });
      }
      navigate('/admin');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: error.message || "حدث خطأ أثناء حفظ المنشور",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading && isEditMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-crypto-darkBlue">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-crypto-orange"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-crypto-darkBlue to-crypto-darkGray p-4">
      <div className="container mx-auto py-8 max-w-3xl">
        <Card className="bg-crypto-darkGray/80 backdrop-blur-md border border-white/10 text-white shadow-lg">
          <CardHeader className="border-b border-white/10 pb-4">
            <div className="flex justify-between items-center">
              <Button 
                variant="ghost" 
                className="text-white hover:text-crypto-orange"
                onClick={() => navigate('/admin')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                العودة
              </Button>
              <CardTitle className="text-xl font-bold text-crypto-orange">
                {isEditMode ? 'تعديل منشور' : 'إضافة منشور جديد'}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white mb-2">العنوان</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="أدخل عنوان المنشور"
                  className="bg-crypto-darkBlue/50 border-white/20 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white mb-2">الملخص</label>
                <Textarea
                  name="excerpt"
                  value={formData.excerpt || ''}
                  onChange={handleChange}
                  placeholder="أدخل ملخص المنشور"
                  className="bg-crypto-darkBlue/50 border-white/20 text-white min-h-[80px]"
                />
              </div>
              
              <div>
                <label className="block text-white mb-2">المحتوى</label>
                <Textarea
                  name="content"
                  value={formData.content || ''}
                  onChange={handleChange}
                  placeholder="أدخل محتوى المنشور"
                  className="bg-crypto-darkBlue/50 border-white/20 text-white min-h-[200px]"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">الكاتب</label>
                  <Input
                    name="author"
                    value={formData.author || ''}
                    onChange={handleChange}
                    placeholder="أدخل اسم الكاتب"
                    className="bg-crypto-darkBlue/50 border-white/20 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-white mb-2">التصنيف</label>
                  <Input
                    name="category"
                    value={formData.category || ''}
                    onChange={handleChange}
                    placeholder="أدخل تصنيف المنشور"
                    className="bg-crypto-darkBlue/50 border-white/20 text-white"
                  />
                </div>
              </div>
              
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-white mb-2">الرابط الثابت</label>
                  <Input
                    name="slug"
                    value={formData.slug || ''}
                    onChange={handleChange}
                    placeholder="الرابط-الثابت-للمنشور"
                    className="bg-crypto-darkBlue/50 border-white/20 text-white"
                  />
                </div>
                <Button 
                  type="button"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={generateSlug}
                >
                  توليد
                </Button>
              </div>
              
              <div>
                <label className="block text-white mb-2">رابط الصورة</label>
                <Input
                  name="image_url"
                  value={formData.image_url || ''}
                  onChange={handleChange}
                  placeholder="أدخل رابط صورة المنشور"
                  className="bg-crypto-darkBlue/50 border-white/20 text-white"
                />
              </div>
              
              <div>
                <label className="block text-white mb-2">تاريخ النشر</label>
                <Input
                  type="datetime-local"
                  name="publish_date"
                  value={formData.publish_date ? new Date(formData.publish_date).toISOString().slice(0, 16) : ''}
                  onChange={handleChange}
                  className="bg-crypto-darkBlue/50 border-white/20 text-white"
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="border-t border-white/10 pt-4 flex justify-end gap-3">
            <Button 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => navigate('/admin')}
            >
              إلغاء
            </Button>
            <Button 
              type="submit"
              className="bg-crypto-orange hover:bg-crypto-orange/80 text-white"
              onClick={handleSubmit}
              disabled={isSaving}
            >
              <Save className="mr-2 h-4 w-4" />
              {isEditMode ? 'حفظ التغييرات' : 'إضافة المنشور'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminBlogForm;
