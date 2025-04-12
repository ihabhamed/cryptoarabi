import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Save, Copy, Link as LinkIcon } from "lucide-react";
import { useAirdrop, useAddAirdrop, useUpdateAirdrop } from "@/lib/hooks";
import { NewAirdrop } from '@/types/supabase';

const AdminAirdropForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: existingAirdrop, isLoading } = useAirdrop(id);
  const addAirdrop = useAddAirdrop();
  const updateAirdrop = useUpdateAirdrop();
  const [linkCopied, setLinkCopied] = useState(false);
  
  const [formData, setFormData] = useState<NewAirdrop>({
    title: '',
    description: '',
    status: 'upcoming',
    twitter_link: '',
    youtube_link: '',
    claim_url: '',
    start_date: '',
    end_date: '',
    image_url: '',
    publish_date: new Date().toISOString()
  });
  
  // Load data from localStorage or API
  useEffect(() => {
    const loadFormData = async () => {
      if (isEditMode && existingAirdrop) {
        // For edit mode, use the data from useAirdrop hook
        const airdropData = {
          title: existingAirdrop.title,
          description: existingAirdrop.description || '',
          status: existingAirdrop.status,
          twitter_link: existingAirdrop.twitter_link || '',
          youtube_link: existingAirdrop.youtube_link || '',
          claim_url: existingAirdrop.claim_url || '',
          start_date: existingAirdrop.start_date || '',
          end_date: existingAirdrop.end_date || '',
          image_url: existingAirdrop.image_url || '',
          publish_date: existingAirdrop.publish_date
        };
        
        setFormData(airdropData);
        
        // Save to localStorage in edit mode with unique key
        const storageKey = `airdropFormData_${id}`;
        localStorage.setItem(storageKey, JSON.stringify({
          ...airdropData,
          id: id
        }));
      } else if (!isEditMode) {
        // For new entry, check localStorage
        const storageKey = 'airdropFormData_new';
        const savedData = localStorage.getItem(storageKey);
        
        if (savedData) {
          try {
            const parsedData = JSON.parse(savedData);
            
            setFormData({
              title: parsedData.title || '',
              description: parsedData.description || '',
              status: parsedData.status || 'upcoming',
              twitter_link: parsedData.twitter_link || '',
              youtube_link: parsedData.youtube_link || '',
              claim_url: parsedData.claim_url || '',
              start_date: parsedData.start_date || '',
              end_date: parsedData.end_date || '',
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
  }, [existingAirdrop, id, isEditMode]);
  
  // Save form data to localStorage whenever it changes
  useEffect(() => {
    // Only save if there's actual data
    if (formData.title) {
      const storageKey = isEditMode && id ? `airdropFormData_${id}` : 'airdropFormData_new';
      localStorage.setItem(storageKey, JSON.stringify({
        ...formData,
        id: id
      }));
      
      // Log storage for debugging
      console.log(`Saving airdrop form data to localStorage with key: ${storageKey}`);
    }
  }, [formData, id, isEditMode]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!formData.title || !formData.status) {
        throw new Error('العنوان والحالة مطلوبان');
      }
      
      if (isEditMode && id) {
        await updateAirdrop.mutateAsync({
          id,
          ...formData
        });
        toast({
          title: "تم التحديث بنجاح",
          description: "تم تحديث الإيردروب بنجاح",
        });
      } else {
        await addAirdrop.mutateAsync(formData);
        toast({
          title: "تمت الإضافة بنجاح",
          description: "تم إضافة الإيردروب بنجاح",
        });
      }
      
      // Clear form data after successful submission
      const storageKey = isEditMode && id ? `airdropFormData_${id}` : 'airdropFormData_new';
      localStorage.removeItem(storageKey);
      navigate('/admin');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: error.message || "حدث خطأ أثناء حفظ الإيردروب",
      });
    }
  };
  
  // Cancel button handler
  const handleCancel = () => {
    const storageKey = isEditMode && id ? `airdropFormData_${id}` : 'airdropFormData_new';
    localStorage.removeItem(storageKey);
    navigate('/admin');
  };

  // Copy link to clipboard
  const copyAirdropLink = () => {
    if (isEditMode && id) {
      const link = `${window.location.origin}/airdrop/${id}`;
      navigator.clipboard.writeText(link).then(() => {
        setLinkCopied(true);
        toast({
          title: "تم النسخ",
          description: "تم نسخ الرابط بنجاح",
        });
        setTimeout(() => setLinkCopied(false), 2000);
      });
    } else {
      toast({
        variant: "destructive",
        title: "غير متاح",
        description: "يجب حفظ الإيردروب أولاً قبل نسخ الرابط",
      });
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
                {isEditMode ? 'تعديل إيردروب' : 'إضافة إيردروب جديد'}
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
                  placeholder="أدخل عنوان الإيردروب"
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
                  placeholder="أدخل وصف الإيردروب"
                  className="bg-crypto-darkBlue/50 border-white/20 text-white min-h-[120px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">تاريخ البداية</label>
                  <Input
                    type="datetime-local"
                    name="start_date"
                    value={formData.start_date ? new Date(formData.start_date).toISOString().slice(0, 16) : ''}
                    onChange={handleChange}
                    className="bg-crypto-darkBlue/50 border-white/20 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-white mb-2">تاريخ النهاية</label>
                  <Input
                    type="datetime-local"
                    name="end_date"
                    value={formData.end_date ? new Date(formData.end_date).toISOString().slice(0, 16) : ''}
                    onChange={handleChange}
                    className="bg-crypto-darkBlue/50 border-white/20 text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-white mb-2">الحالة</label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger className="bg-crypto-darkBlue/50 border-white/20 text-white">
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent className="bg-crypto-darkBlue border-white/20 text-white">
                    <SelectItem value="upcoming">قادم</SelectItem>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="expired">منتهي</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-white mb-2">رابط الصورة</label>
                <Input
                  name="image_url"
                  value={formData.image_url || ''}
                  onChange={handleChange}
                  placeholder="أدخل رابط صورة الإيردروب (اختياري)"
                  className="bg-crypto-darkBlue/50 border-white/20 text-white"
                />
              </div>
              
              <div>
                <label className="block text-white mb-2">رابط تويتر</label>
                <Input
                  name="twitter_link"
                  value={formData.twitter_link || ''}
                  onChange={handleChange}
                  placeholder="أدخل رابط تويتر (اختياري)"
                  className="bg-crypto-darkBlue/50 border-white/20 text-white"
                />
              </div>
              
              <div>
                <label className="block text-white mb-2">رابط يوتيوب</label>
                <Input
                  name="youtube_link"
                  value={formData.youtube_link || ''}
                  onChange={handleChange}
                  placeholder="أدخل رابط فيديو يوتيوب (اختياري)"
                  className="bg-crypto-darkBlue/50 border-white/20 text-white"
                />
              </div>
              
              <div>
                <label className="block text-white mb-2">رابط الحصول</label>
                <Input
                  name="claim_url"
                  value={formData.claim_url || ''}
                  onChange={handleChange}
                  placeholder="أدخل رابط الحصول على الإيردروب (اختياري)"
                  className="bg-crypto-darkBlue/50 border-white/20 text-white"
                />
              </div>

              {isEditMode && id && (
                <div className="mt-4 p-4 bg-crypto-darkBlue/30 rounded-md">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <LinkIcon className="h-5 w-5 text-crypto-orange mr-2" />
                      <span className="text-white">رابط الإيردروب:</span>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="border-crypto-orange text-crypto-orange hover:bg-crypto-orange/10"
                      onClick={copyAirdropLink}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {linkCopied ? "تم النسخ" : "نسخ الرابط"}
                    </Button>
                  </div>
                  <p className="text-gray-400 text-sm mt-2 truncate">
                    {`${window.location.origin}/airdrop/${id}`}
                  </p>
                </div>
              )}
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
              disabled={addAirdrop.isPending || updateAirdrop.isPending}
            >
              <Save className="mr-2 h-4 w-4" />
              {isEditMode ? 'حفظ التغييرات' : 'إضافة الإيردروب'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminAirdropForm;
