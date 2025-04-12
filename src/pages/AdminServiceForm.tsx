import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/utils/toast-utils";
import { Service } from '@/types/supabase';
import { uploadImage } from '@/lib/utils/imageUpload';
import ImageUploader from '@/components/admin/blog/ImageUploader';

const AdminServiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Service>>({
    title: '',
    description: '',
    price: '',
    duration: '',
    image_url: '',
  });
  
  // Load data for edit mode
  useEffect(() => {
    const loadServiceData = async () => {
      if (isEditMode && id) {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('id', id)
            .maybeSingle();
          
          if (error) throw error;
          
          if (data) {
            setFormData({
              title: data.title,
              description: data.description || '',
              price: data.price || '',
              duration: data.duration || '',
              image_url: data.image_url || '',
            });
            
            if (data.image_url) {
              setPreviewUrl(data.image_url);
            }
          }
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "خطأ في جلب البيانات",
            description: error.message || "حدث خطأ أثناء محاولة جلب بيانات الخدمة",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadServiceData();
  }, [id, isEditMode]);
  
  // Form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (file: File | null) => {
    if (!file) return;
    setSelectedImage(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };
  
  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (previewUrl && !previewUrl.startsWith('http')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFormData(prev => ({ ...prev, image_url: '' }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Validate required fields
      if (!formData.title) {
        throw new Error('عنوان الخدمة مطلوب');
      }
      
      let finalFormData = { ...formData };
      
      // Upload image if selected
      if (selectedImage) {
        setUploadingImage(true);
        const imageUrl = await uploadImage(selectedImage, 'services');
        setUploadingImage(false);
        
        if (!imageUrl) {
          throw new Error('فشل في رفع الصورة');
        }
        
        finalFormData.image_url = imageUrl;
      }
      
      if (isEditMode && id) {
        const { error } = await supabase
          .from('services')
          .update(finalFormData)
          .eq('id', id);
        
        if (error) throw error;
        
        toast({
          title: "تم التحديث بنجاح",
          description: "تم تحديث الخدمة بنجاح",
        });
      } else {
        // Ensure title is provided for new services
        if (!finalFormData.title) {
          throw new Error('عنوان الخدمة مطلوب');
        }
        
        const { error } = await supabase
          .from('services')
          .insert({
            title: finalFormData.title, // Explicitly provide title to satisfy TypeScript
            description: finalFormData.description || null,
            price: finalFormData.price || null,
            duration: finalFormData.duration || null,
            image_url: finalFormData.image_url || null
          });
        
        if (error) throw error;
        
        toast({
          title: "تمت الإضافة بنجاح",
          description: "تم إضافة الخدمة بنجاح",
        });
      }
      
      navigate('/admin');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: error.message || "حدث خطأ أثناء حفظ الخدمة",
      });
    } finally {
      setIsSaving(false);
      setUploadingImage(false);
    }
  };
  
  // Cancel button handler
  const handleCancel = () => {
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
                {isEditMode ? 'تعديل خدمة' : 'إضافة خدمة جديدة'}
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
                  placeholder="أدخل عنوان الخدمة"
                  className="bg-crypto-darkBlue/50 border-white/20 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white mb-2">الوصف</label>
                <Textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  placeholder="أدخل وصف الخدمة"
                  className="bg-crypto-darkBlue/50 border-white/20 text-white min-h-[120px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">السعر</label>
                  <Input
                    name="price"
                    value={formData.price || ''}
                    onChange={handleChange}
                    placeholder="أدخل سعر الخدمة"
                    className="bg-crypto-darkBlue/50 border-white/20 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-white mb-2">المدة</label>
                  <Input
                    name="duration"
                    value={formData.duration || ''}
                    onChange={handleChange}
                    placeholder="أدخل مدة الخدمة"
                    className="bg-crypto-darkBlue/50 border-white/20 text-white"
                  />
                </div>
              </div>
              
              <ImageUploader 
                previewUrl={previewUrl}
                onImageChange={handleImageChange}
                onImageUrlChange={(url) => handleChange({ 
                  target: { name: 'image_url', value: url }
                } as React.ChangeEvent<HTMLInputElement>)}
                onRemoveImage={handleRemoveImage}
                imageUrl={formData.image_url || ''}
                isUploading={uploadingImage}
              />
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
              {isEditMode ? 'حفظ التغييرات' : 'إضافة الخدمة'}
              {(isSaving || uploadingImage) && <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminServiceForm;
