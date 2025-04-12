
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from '@/types/supabase';
import { uploadImage, validateImageFile } from '@/lib/utils/imageUpload';

const AdminBlogForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
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
  
  // Load data from localStorage or API
  useEffect(() => {
    const loadFormData = async () => {
      if (isEditMode && id) {
        // For edit mode, fetch from API
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('id', id)
            .maybeSingle();
          
          if (error) throw error;
          
          if (data) {
            const blogData = {
              title: data.title,
              content: data.content,
              excerpt: data.excerpt || '',
              author: data.author || '',
              category: data.category || '',
              slug: data.slug || '',
              image_url: data.image_url || '',
              publish_date: data.publish_date
            };
            
            setFormData(blogData);
            
            // Set image preview if image_url exists
            if (data.image_url) {
              setPreviewUrl(data.image_url);
            }
            
            // Save to localStorage in edit mode with unique key
            const storageKey = `blogFormData_${id}`;
            localStorage.setItem(storageKey, JSON.stringify({
              ...blogData,
              id: id
            }));
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
      } else {
        // For new entry, check localStorage
        const storageKey = 'blogFormData_new';
        const savedData = localStorage.getItem(storageKey);
        
        if (savedData) {
          try {
            const parsedData = JSON.parse(savedData);
            
            setFormData({
              title: parsedData.title || '',
              content: parsedData.content || '',
              excerpt: parsedData.excerpt || '',
              author: parsedData.author || '',
              category: parsedData.category || '',
              slug: parsedData.slug || '',
              image_url: parsedData.image_url || '',
              publish_date: parsedData.publish_date || new Date().toISOString()
            });
          } catch (e) {
            // If parsing fails, continue with empty form
            console.error("Error parsing saved form data", e);
          }
        }
      }
    };
    
    loadFormData();
  }, [id, isEditMode, toast]);
  
  // Save form data to localStorage whenever it changes
  useEffect(() => {
    // Only save if there's actual data
    if (formData.title || formData.content) {
      const storageKey = isEditMode && id ? `blogFormData_${id}` : 'blogFormData_new';
      localStorage.setItem(storageKey, JSON.stringify({
        ...formData,
        id: id
      }));
    }
  }, [formData, id, isEditMode]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const error = validateImageFile(file);
    if (error) {
      toast({
        variant: "destructive",
        title: "خطأ في الصورة",
        description: error,
      });
      return;
    }
    
    setSelectedImage(file);
    
    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Clear the input value so the same file can be selected again if needed
    e.target.value = '';
  };
  
  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (previewUrl && !previewUrl.startsWith('http')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFormData(prev => ({ ...prev, image_url: '' }));
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
      
      // Validate that required fields are present
      if (!formData.title || !formData.content) {
        throw new Error('العنوان والمحتوى مطلوبان');
      }
      
      let finalFormData = { ...formData };
      
      // Upload image if selected
      if (selectedImage) {
        setUploadingImage(true);
        const imageUrl = await uploadImage(selectedImage, 'blog');
        setUploadingImage(false);
        
        if (!imageUrl) {
          toast({
            variant: "destructive",
            title: "خطأ في رفع الصورة",
            description: "حدث خطأ أثناء رفع الصورة، يرجى المحاولة مرة أخرى",
          });
          return;
        }
        
        finalFormData = { ...finalFormData, image_url: imageUrl };
      }
      
      if (isEditMode && id) {
        // Ensure required fields are present in the update
        const updateData = {
          ...finalFormData,
          title: finalFormData.title as string, // Type assertion since we've validated it's present
          content: finalFormData.content as string // Type assertion since we've validated it's present
        };
        
        const { error } = await supabase
          .from('blog_posts')
          .update(updateData)
          .eq('id', id);
        
        if (error) throw error;
        
        toast({
          title: "تم التحديث بنجاح",
          description: "تم تحديث المنشور بنجاح",
        });
      } else {
        // For insertion, explicitly provide required fields
        const newPost = {
          title: finalFormData.title as string, // Already validated above
          content: finalFormData.content as string, // Already validated above
          excerpt: finalFormData.excerpt,
          author: finalFormData.author,
          category: finalFormData.category,
          slug: finalFormData.slug,
          image_url: finalFormData.image_url,
          publish_date: finalFormData.publish_date
        };
        
        const { error } = await supabase
          .from('blog_posts')
          .insert(newPost);
        
        if (error) throw error;
        
        toast({
          title: "تمت الإضافة بنجاح",
          description: "تم إضافة المنشور بنجاح",
        });
      }
      
      // Clear form data after successful submission
      const storageKey = isEditMode && id ? `blogFormData_${id}` : 'blogFormData_new';
      localStorage.removeItem(storageKey);
      navigate('/admin');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: error.message || "حدث خطأ أثناء حفظ المنشور",
      });
    } finally {
      setIsSaving(false);
      setUploadingImage(false);
    }
  };
  
  // Cancel button handler
  const handleCancel = () => {
    const storageKey = isEditMode && id ? `blogFormData_${id}` : 'blogFormData_new';
    localStorage.removeItem(storageKey);
    navigate('/admin');
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
                  value={formData.title || ''}
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
                <label className="block text-white mb-2">صورة المنشور</label>
                
                {/* Image Preview */}
                {previewUrl && (
                  <div className="relative mt-2 mb-4 w-full max-w-xs mx-auto">
                    <img 
                      src={previewUrl} 
                      alt="معاينة الصورة" 
                      className="w-full h-auto rounded-md border border-white/20 object-cover aspect-video"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                <div className="flex flex-col gap-3">
                  {/* File Upload */}
                  <div className="relative">
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="flex items-center justify-center gap-2 p-4 bg-crypto-darkBlue/50 border-2 border-dashed border-white/20 rounded-md hover:bg-crypto-darkBlue/70 transition-colors">
                        <Upload className="h-5 w-5 text-crypto-orange" />
                        <span>اختر صورة للرفع أو اسحبها هنا</span>
                      </div>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                  
                  {/* URL Input */}
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm">أو</span>
                    <Input
                      name="image_url"
                      value={formData.image_url || ''}
                      onChange={handleChange}
                      placeholder="أدخل رابط صورة المنشور"
                      className="bg-crypto-darkBlue/50 border-white/20 text-white"
                      disabled={!!selectedImage}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">يسمح بالصور بحجم أقصى 2 ميغابايت، بصيغة JPG، PNG، GIF أو WEBP.</p>
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
              onClick={handleCancel}
            >
              إلغاء
            </Button>
            <Button 
              type="submit"
              className="bg-crypto-orange hover:bg-crypto-orange/80 text-white"
              onClick={handleSubmit}
              disabled={isSaving || uploadingImage}
            >
              <Save className="mr-2 h-4 w-4" />
              {isEditMode ? 'حفظ التغييرات' : 'إضافة المنشور'}
              {(isSaving || uploadingImage) && <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminBlogForm;
