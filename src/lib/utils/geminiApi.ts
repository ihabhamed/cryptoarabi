
// Utility functions for Google Gemini API

export async function generateMetaTags(title: string, content: string) {
  try {
    const response = await fetch(`https://tlpiqkbiwcdyzpqqzsbg.supabase.co/functions/v1/generate-meta-tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ title, content })
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate meta tags');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error generating meta tags:', error);
    // Fallback to simple summarization if API call fails
    return {
      metaTitle: title,
      metaDescription: content ? content.substring(0, 157) + '...' : ''
    };
  }
}
