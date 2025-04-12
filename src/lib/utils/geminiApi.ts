
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
    
    // Use the hardcoded API key for now
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRscGlxa2Jpd2NkeXpwcXF6c2JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0MjE4MzgsImV4cCI6MjA1OTk5NzgzOH0.5KKw0L7Uo-lsFK0ovvhZXh-_LKYGPE9qq2SIE90acvg";
    
    // Make the API request with proper authentication
    const response = await fetch(`https://tlpiqkbiwcdyzpqqzsbg.supabase.co/functions/v1/generate-hashtags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY
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
