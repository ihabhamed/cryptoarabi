
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Service } from '@/types/supabase';

const AdminServiceForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Service>>({
    title: '',
    description: '',
    price: '',
    duration: '',
    image_url: ''
  });
  
  // Load data from localStorage or API
  useEffect(() => {
    const loadFormData = async () => {
      if (isEditMode && id) {
        // For edit mode, fetch from API
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
              image_url: data.image_url || ''
            });
            
            // Save to localStorage in edit mode
            localStorage.setItem('serviceFormData', JSON.stringify({
              ...data,
              id: id
            }));
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
      } else {
        // For new entry, check localStorage
        const savedData = localStorage.getItem('serviceFormData');
        
        if (savedData) {
          try {
            const parsedData = JSON.parse(savedData);
            
            // Only use saved data if we're not in edit mode or if the IDs match
            if (!isEditMode || (parsedData.id === id)) {
              setFormData({
                title: parsedData.title || '',
                description: parsedData.description || '',
                price: parsedData.price || '',
                duration: parsedData.duration || '',
                image_url: parsedData.image_url || ''
              });
            }
          } catch (e) {
            // If parsing fails, continue with empty form
            console.error("Error parsing saved form data", e);
          }
        }
      }
    };
    
    loadFormData();
    
    // Cleanup function to prevent memory leaks
    return () => {
      if (!isEditMode) {
        // Don't clear localStorage when navigating away in edit mode
        // This allows us to preserve data between tab switches
      }
    };
  }, [id, isEditMode, toast]);
  
  // Save form data to localStorage whenever it changes
  useEffect(() => {
    // Only save if there's actual data and not just the initial empty state
    if (formData.title || formData.description || formData.price || formData.duration || formData.image_url) {
      localStorage.setItem('serviceFormData', JSON.stringify({
        ...formData,
        id: id
      }));
    }
  }, [formData, id]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Validate that required fields are present
      if (!formData.title) {
        throw new Error('عنوان الخدمة مطلوب');
      }
      
      if (isEditMode && id) {
        const { error } = await supabase
          .from('services')
          .update(formData)
          .eq('id', id);
        
        if (error) throw error;
        
        toast({
          title: "تم التحديث بنجاح",
          description: "تم تحديث الخدمة بنجاح",
        });
      } else {
        // Make sure we have the required fields for insertion
        const newService = {
          title: formData.title,
          description: formData.description,
          price: formData.price,
          duration: formData.duration,
          image_url: formData.image_url
        };
        
        const { error } = await supabase
          .from('services')
          .insert(newService);
        
        if (error) throw error;
        
        toast({
          title: "تمت الإضافة بنجاح",
          description: "تم إضافة الخدمة بنجاح",
        });
      }
      
      // Clear form data after successful submission
      localStorage.removeItem('serviceFormData');
      navigate('/admin');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: error.message || "حدث خطأ أثناء حفظ الخدمة",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Cancel button handler
  const handleCancel = () => {
    if (!isEditMode) {
      // Clear form data when cancelling new service
      localStorage.removeItem('serviceFormData');
    }
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
              
              <div>
                <label className="block text-white mb-2">رابط الصورة</label>
                <Input
                  name="image_url"
                  value={formData.image_url || ''}
                  onChange={handleChange}
                  placeholder="أدخل رابط صورة الخدمة"
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
              disabled={isSaving}
            >
              <Save className="mr-2 h-4 w-4" />
              {isEditMode ? 'حفظ التغييرات' : 'إضافة الخدمة'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminServiceForm;
