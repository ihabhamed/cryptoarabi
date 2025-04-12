
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

    // Call the Gemini API for hashtag generation
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
                text: `Generate 5-8 relevant hashtags based on this title: "${title}" and content: "${content}".
                The hashtags should be relevant to cryptocurrency, blockchain, or tech topics if applicable, but should primarily match the content.
                Format your response as a JSON array with only the hashtag words (without # symbol).
                Example: ["bitcoin", "crypto", "blockchain", "investment", "technology"]`
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
    
    // Parse the response text to extract the hashtags
    const responseText = geminiResponse.candidates[0].content.parts[0].text;
    
    // Extract JSON from the response (handling potential markdown formatting)
    let jsonStr = responseText;
    if (responseText.includes('```json')) {
      jsonStr = responseText.split('```json')[1].split('```')[0].trim();
    } else if (responseText.includes('```')) {
      jsonStr = responseText.split('```')[1].split('```')[0].trim();
    }
    
    let hashtags = [];
    try {
      hashtags = JSON.parse(jsonStr);
    } catch (e) {
      // Fallback to regex parsing if JSON parsing fails
      const matches = responseText.match(/\[(.*?)\]/);
      if (matches && matches[1]) {
        hashtags = matches[1].split(',').map(tag => tag.trim().replace(/"/g, '').replace(/'/g, ''));
      } else {
        // Last resort: just extract words that look like they could be hashtags
        hashtags = responseText.match(/\b\w+\b/g)?.slice(0, 8) || [];
      }
    }
    
    return new Response(
      JSON.stringify({ hashtags }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error("Error in generate-hashtags function:", error);
    
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
