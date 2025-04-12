
import { useState, useEffect } from 'react';
import { useAirdrop, useAddAirdrop, useUpdateAirdrop } from "@/lib/hooks";
import { useToast } from "@/hooks/use-toast";
import { NewAirdrop } from '@/types/supabase';
import { uploadImage } from '@/lib/utils/imageUpload';

interface UseAirdropFormProps {
  id?: string;
  onSuccess?: () => void;
}

export function useAirdropForm({ id, onSuccess }: UseAirdropFormProps) {
  const isEditMode = !!id;
  const { toast } = useToast();
  const { data: existingAirdrop, isLoading } = useAirdrop(id);
  const addAirdrop = useAddAirdrop();
  const updateAirdrop = useUpdateAirdrop();
  const [linkCopied, setLinkCopied] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
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
    
    // If in edit mode and the airdrop has an image_url, set it as the preview
    if (isEditMode && existingAirdrop?.image_url) {
      setPreviewUrl(existingAirdrop.image_url);
    }
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
    }
  }, [formData, id, isEditMode]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (file: File | null) => {
    if (!file) return;
    
    setSelectedImage(file);
    
    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };
  
  const handleImageUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, image_url: url }));
    
    // If we have a direct URL, show it as preview and clear any file selection
    if (url) {
      setSelectedImage(null);
      setPreviewUrl(url);
    } else if (!selectedImage) {
      setPreviewUrl(null);
    }
  };
  
  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (previewUrl && !previewUrl.startsWith('http')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFormData(prev => ({ ...prev, image_url: '' }));
  };
  
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!formData.title || !formData.status) {
        throw new Error('العنوان والحالة مطلوبان');
      }
      
      let finalFormData = { ...formData };
      
      // Upload image if selected
      if (selectedImage) {
        setUploadingImage(true);
        const imageUrl = await uploadImage(selectedImage, 'airdrops');
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
        await updateAirdrop.mutateAsync({
          id,
          ...finalFormData
        });
        toast({
          title: "تم التحديث بنجاح",
          description: "تم تحديث الإيردروب بنجاح",
        });
      } else {
        await addAirdrop.mutateAsync(finalFormData);
        toast({
          title: "تمت الإضافة بنجاح",
          description: "تم إضافة الإيردروب بنجاح",
        });
      }
      
      // Clear form data after successful submission
      const storageKey = isEditMode && id ? `airdropFormData_${id}` : 'airdropFormData_new';
      localStorage.removeItem(storageKey);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: error.message || "حدث خطأ أثناء حفظ الإيردروب",
      });
    }
  };

  return {
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
    isSaving: addAirdrop.isPending || updateAirdrop.isPending
  };
}
