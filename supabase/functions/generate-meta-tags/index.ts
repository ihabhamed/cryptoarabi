
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, content } = await req.json();
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    if (!geminiApiKey) {
      throw new Error('Gemini API key not found');
    }

    // Call the Gemini API for meta tag generation
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': geminiApiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Generate two things:
                1. A meta title (60-70 characters) based on this title: "${title}"
                2. A meta description (EXACTLY 160 characters or less) that summarizes this content: "${content}"
                
                Format your response as JSON with 'metaTitle' and 'metaDescription' fields.`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${JSON.stringify(errorData)}`);
    }

    const geminiResponse = await response.json();
    
    // Parse the response text to extract the JSON
    const responseText = geminiResponse.candidates[0].content.parts[0].text;
    
    // Extract JSON from the response (handling potential markdown formatting)
    let jsonStr = responseText;
    if (responseText.includes('```json')) {
      jsonStr = responseText.split('```json')[1].split('```')[0].trim();
    } else if (responseText.includes('```')) {
      jsonStr = responseText.split('```')[1].split('```')[0].trim();
    }
    
    let metaData;
    try {
      metaData = JSON.parse(jsonStr);
    } catch (e) {
      // Fallback to regex parsing if JSON parsing fails
      const metaTitleMatch = responseText.match(/"metaTitle"\s*:\s*"([^"]+)"/);
      const metaDescMatch = responseText.match(/"metaDescription"\s*:\s*"([^"]+)"/);
      
      metaData = {
        metaTitle: metaTitleMatch ? metaTitleMatch[1] : title,
        metaDescription: metaDescMatch ? metaDescMatch[1] : content.substring(0, 157) + '...'
      };
    }
    
    // Ensure meta description is no more than 160 characters
    if (metaData.metaDescription && metaData.metaDescription.length > 160) {
      metaData.metaDescription = metaData.metaDescription.substring(0, 157) + '...';
    }
    
    return new Response(
      JSON.stringify(metaData),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error("Error in generate-meta-tags function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
