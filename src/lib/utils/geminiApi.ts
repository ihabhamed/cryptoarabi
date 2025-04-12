
// Utility functions for Google Gemini API

export async function generateMetaTags(title: string, content: string) {
  try {
    console.log("Generating meta tags for:", { title, content: content?.substring(0, 50) + "..." });
    
    // Use the hardcoded API key for now
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRscGlxa2Jpd2NkeXpwcXF6c2JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0MjE4MzgsImV4cCI6MjA1OTk5NzgzOH0.5KKw0L7Uo-lsFK0ovvhZXh-_LKYGPE9qq2SIE90acvg";
    
    // If content is too long, trim it to avoid exceeding API limits
    const trimmedContent = content && content.length > 1000 ? content.substring(0, 1000) + "..." : content;
    
    const response = await fetch(`https://tlpiqkbiwcdyzpqqzsbg.supabase.co/functions/v1/generate-meta-tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify({ title, content: trimmedContent || "" })
    });
    
    // Get the response data regardless of status
    const data = await response.json();
    
    // If we have error in the data but also have fallback metaTitle/metaDescription
    if (data.error && (data.metaTitle || data.metaDescription)) {
      console.warn("Meta tags generation had an error but provided fallbacks:", data.error);
      return {
        metaTitle: data.metaTitle || title,
        metaDescription: data.metaDescription || (content && content.length > 160 ? content.substring(0, 157) + '...' : content)
      };
    }
    
    // If response is not ok and we don't have fallbacks
    if (!response.ok && !data.metaTitle) {
      console.error("Meta tags API error:", data);
      // Return simple fallback data
      return {
        metaTitle: title,
        metaDescription: content && content.length > 160 ? content.substring(0, 157) + '...' : content
      };
    }
    
    console.log("Meta tags generated:", data);
    return data;
  } catch (error) {
    console.error('Error generating meta tags:', error);
    // Fallback to simple summarization if API call fails
    return {
      metaTitle: title,
      metaDescription: content && content.length > 160 ? content.substring(0, 157) + '...' : content
    };
  }
}

export async function generateHashtags(title: string, content: string) {
  try {
    console.log("Generating hashtags for:", { title, content: content?.substring(0, 50) + "..." });
    
    // Use the hardcoded API key for now
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRscGlxa2Jpd2NkeXpwcXF6c2JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0MjE4MzgsImV4cCI6MjA1OTk5NzgzOH0.5KKw0L7Uo-lsFK0ovvhZXh-_LKYGPE9qq2SIE90acvg";
    
    // If content is too long, trim it to avoid exceeding API limits
    const trimmedContent = content && content.length > 1000 ? content.substring(0, 1000) + "..." : content;
    
    // Make the API request with proper authentication
    const response = await fetch(`https://tlpiqkbiwcdyzpqqzsbg.supabase.co/functions/v1/generate-hashtags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify({ 
        title, 
        content: trimmedContent || "",
        language: "ar" // Request Arabic hashtags
      })
    });
    
    console.log("API response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Hashtags API error:", response.status, errorData);
      
      // Provide fallback Arabic hashtags if API fails
      const fallbackHashtags = ["كريبتو", "بلوكتشين", "عملات_رقمية", "ويب3", "إيردروب"];
      console.log("Using fallback hashtags due to API error:", fallbackHashtags);
      return fallbackHashtags;
    }
    
    const data = await response.json();
    
    if (!data || !data.hashtags || !Array.isArray(data.hashtags) || data.hashtags.length === 0) {
      // Return fallback Arabic hashtags if response is invalid
      const fallbackHashtags = ["كريبتو", "بلوكتشين", "عملات_رقمية", "ويب3", "إيردروب"];
      console.log("Using fallback hashtags due to invalid response:", fallbackHashtags);
      return fallbackHashtags;
    }
    
    console.log("Hashtags generated:", data);
    return data.hashtags;
  } catch (error) {
    console.error('Error generating hashtags:', error);
    // Return fallback Arabic hashtags on error
    const fallbackHashtags = ["كريبتو", "بلوكتشين", "عملات_رقمية", "ويب3", "إيردروب"];
    console.log("Using fallback hashtags due to error:", fallbackHashtags);
    return fallbackHashtags;
  }
}
