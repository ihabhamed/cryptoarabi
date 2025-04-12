
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import BlogFormFields from '@/components/admin/blog/BlogFormFields';
import ImageUploader from '@/components/admin/blog/ImageUploader';
import { useBlogForm } from '@/hooks/useBlogForm';

const AdminBlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const {
    formData,
    isLoading,
    isSaving,
    uploadingImage,
    previewUrl,
    isEditMode,
    handleChange,
    handleImageChange,
    handleRemoveImage,
    generateSlug,
    handleSubmit
  } = useBlogForm({
    id,
    onSuccess: () => navigate('/admin')
  });
  
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
              <BlogFormFields 
                formData={formData}
                handleChange={handleChange}
                generateSlug={generateSlug}
              />
              
              <div className="mt-6 border-t border-white/10 pt-6">
                <h3 className="text-lg font-medium text-white mb-4">صورة المنشور</h3>
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
