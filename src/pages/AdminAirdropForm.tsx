
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Copy, Link as LinkIcon } from "lucide-react";
import AirdropFormFields from '@/components/admin/airdrop/AirdropFormFields';
import ImageUploader from '@/components/admin/blog/ImageUploader';
import { useAirdropForm } from '@/hooks/useAirdropForm';

const AdminAirdropForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const {
    formData,
    isLoading,
    isEditMode,
    uploadingImage,
    previewUrl,
    linkCopied,
    handleChange,
    handleSelectChange,
    handleImageChange,
    handleImageUrlChange,
    handleRemoveImage,
    handleSubmit,
    copyAirdropLink,
    isSaving
  } = useAirdropForm({
    id,
    onSuccess: () => navigate('/admin')
  });
  
  // Cancel button handler
  const handleCancel = () => {
    const storageKey = isEditMode && id ? `airdropFormData_${id}` : 'airdropFormData_new';
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
                {isEditMode ? 'تعديل إيردروب' : 'إضافة إيردروب جديد'}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <AirdropFormFields 
                formData={formData}
                handleChange={handleChange}
                handleSelectChange={handleSelectChange}
              />
              
              <div className="mt-6 border-t border-white/10 pt-6">
                <h3 className="text-lg font-medium text-white mb-4">صورة الإيردروب</h3>
                <ImageUploader 
                  previewUrl={previewUrl}
                  onImageChange={handleImageChange}
                  onImageUrlChange={handleImageUrlChange}
                  onRemoveImage={handleRemoveImage}
                  imageUrl={formData.image_url || ''}
                  isUploading={uploadingImage}
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
              disabled={isSaving || uploadingImage}
            >
              <Save className="mr-2 h-4 w-4" />
              {isEditMode ? 'حفظ التغييرات' : 'إضافة الإيردروب'}
              {(isSaving || uploadingImage) && <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminAirdropForm;
