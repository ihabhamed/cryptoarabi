
import { useState, useEffect } from 'react';
import { toast } from "@/lib/utils/toast-utils";
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from '@/types/supabase';
import { uploadImage } from '@/lib/utils/imageUpload';

interface UseBlogFormProps {
  id?: string;
  onSuccess: () => void;
}

export const useBlogForm = ({ id, onSuccess }: UseBlogFormProps) => {
  const isEditMode = !!id;
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
  }, [id, isEditMode]);
  
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
  
  const handleImageChange = (file: File | null) => {
    if (!file) return;
    
    setSelectedImage(file);
    
    // Create a preview URL
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
      onSuccess();
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

  return {
    formData,
    isLoading,
    isSaving,
    uploadingImage,
    selectedImage,
    previewUrl,
    isEditMode,
    handleChange,
    handleImageChange,
    handleRemoveImage,
    generateSlug,
    handleSubmit,
    setFormData
  };
};
