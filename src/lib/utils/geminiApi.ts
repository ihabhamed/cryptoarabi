
// Utility functions for Google Gemini API

export async function generateMetaTags(title: string, content: string) {
  try {
    console.log("Generating meta tags for:", { title, content });
    const response = await fetch(`https://tlpiqkbiwcdyzpqqzsbg.supabase.co/functions/v1/generate-meta-tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ title, content })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Meta tags API error:", errorData);
      throw new Error('Failed to generate meta tags');
    }
    
    const data = await response.json();
    console.log("Meta tags generated:", data);
    return data;
  } catch (error) {
    console.error('Error generating meta tags:', error);
    // Fallback to simple summarization if API call fails
    return {
      metaTitle: title,
      metaDescription: content.length > 160 ? content.substring(0, 157) + '...' : content
    };
  }
}

export async function generateHashtags(title: string, content: string) {
  try {
    console.log("Generating hashtags for:", { title, content });
    
    // Get the correct anonymous key
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!anonKey) {
      console.error("Missing SUPABASE_ANON_KEY");
      throw new Error('لم نتمكن من توليد هاشتاغات - خطأ في المصادقة');
    }
    
    // Make the API request with proper authorization
    const response = await fetch(`https://tlpiqkbiwcdyzpqqzsbg.supabase.co/functions/v1/generate-hashtags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`
      },
      body: JSON.stringify({ title, content })
    });
    
    console.log("API response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Hashtags API error:", response.status, errorData);
      throw new Error('فشل في جلب الهاشتاغات من الخادم');
    }
    
    const data = await response.json();
    console.log("Hashtags generated:", data);
    
    if (!data || !data.hashtags || !Array.isArray(data.hashtags) || data.hashtags.length === 0) {
      throw new Error('لم نتمكن من توليد هاشتاغات للمحتوى الحالي');
    }
    
    return data.hashtags;
  } catch (error) {
    console.error('Error generating hashtags:', error);
    throw error;
  }
}
