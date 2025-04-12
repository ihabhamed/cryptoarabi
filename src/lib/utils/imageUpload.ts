
import { supabase } from '@/integrations/supabase/client';

/**
 * Uploads an image file to Supabase storage and returns the public URL
 * 
 * @param file The image file to upload
 * @param folder The folder to store the image in (e.g., 'airdrops', 'blog')
 * @returns The public URL of the uploaded image or null if upload failed
 */
export async function uploadImage(file: File, folder: string): Promise<string | null> {
  try {
    // Create a unique file name with the original extension
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(data.path);
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

/**
 * Validates if the provided file is an image with acceptable format and size
 * 
 * @param file The file to validate
 * @returns An error message if invalid, or null if valid
 */
export function validateImageFile(file: File): string | null {
  // Check file type
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return 'الملف يجب أن يكون بصيغة JPG أو PNG أو GIF أو WEBP';
  }
  
  // Check file size (max 2MB)
  const maxSize = 2 * 1024 * 1024; // 2MB
  if (file.size > maxSize) {
    return 'حجم الصورة يجب أن يكون أقل من 2 ميغابايت';
  }
  
  return null;
}
