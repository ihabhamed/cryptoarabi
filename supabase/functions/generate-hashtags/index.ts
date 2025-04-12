
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to validate token
const isValidToken = (token: string): boolean => {
  // Check if token is valid
  const expectedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRscGlxa2Jpd2NkeXpwcXF6c2JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0MjE4MzgsImV4cCI6MjA1OTk5NzgzOH0.5KKw0L7Uo-lsFK0ovvhZXh-_LKYGPE9qq2SIE90acvg";
  return token === expectedToken;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Log all headers for debugging (don't log sensitive values)
    console.log("Request headers received");
    
    // Extract and validate token from headers
    const authHeader = req.headers.get('Authorization');
    const apiKeyHeader = req.headers.get('apikey');
    
    // Check for authorization header or apikey (use either)
    let isAuthenticated = false;
    let token = '';
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
      isAuthenticated = isValidToken(token);
      console.log("Auth validated via Authorization header:", isAuthenticated);
    } 
    
    if (!isAuthenticated && apiKeyHeader) {
      isAuthenticated = isValidToken(apiKeyHeader);
      console.log("Auth validated via apikey header:", isAuthenticated);
    }
    
    if (!isAuthenticated) {
      console.error("Authentication failed - invalid or missing token");
      return new Response(
        JSON.stringify({ error: "Authorization failed - invalid token" }),
        { 
          status: 401, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }
    
    // Get request data
    const requestData = await req.json();
    const { title, content } = requestData;
    
    if (!title) {
      return new Response(
        JSON.stringify({ error: "Missing title in request" }),
        { 
          status: 400, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }
    
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    if (!geminiApiKey) {
      console.error("Gemini API key not found");
      throw new Error('Gemini API key not found');
    }

    console.log("Processing request for hashtags with:", { title: title.substring(0, 30) + "..." });

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
                text: `Generate 5-8 relevant hashtags based on this title: "${title}" and content: "${content || ''}".
                The hashtags should be relevant to cryptocurrency, blockchain, or tech topics if applicable, but should primarily match the content.
                Do NOT include the # symbol in the hashtags.
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

    console.log("Gemini API response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Gemini API error:", JSON.stringify(errorData));
      throw new Error(`Gemini API error: ${JSON.stringify(errorData)}`);
    }

    const geminiResponse = await response.json();
    console.log("Gemini response received");
    
    // Check if we have a valid response
    if (!geminiResponse.candidates || geminiResponse.candidates.length === 0) {
      throw new Error("No response generated from Gemini API");
    }
    
    // Parse the response text to extract the hashtags
    const responseText = geminiResponse.candidates[0].content.parts[0].text;
    console.log("Response text length:", responseText.length);
    
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
      console.log("Parsed hashtags count:", hashtags.length);
      
      // Ensure hashtags are not empty and are strings
      if (!Array.isArray(hashtags) || hashtags.length === 0) {
        throw new Error("Invalid hashtags format");
      }
      
      // Make sure all hashtags are strings and don't have # symbol
      hashtags = hashtags.map(tag => {
        if (typeof tag === 'string') {
          return tag.startsWith('#') ? tag.substring(1) : tag;
        }
        return String(tag);
      });
      
    } catch (e) {
      console.error("JSON parsing error:", e);
      // Fallback to regex parsing if JSON parsing fails
      const matches = responseText.match(/\[(.*?)\]/);
      if (matches && matches[1]) {
        hashtags = matches[1].split(',').map(tag => 
          tag.trim().replace(/"/g, '').replace(/'/g, '').replace(/^#/, '')
        );
        console.log("Regex-parsed hashtags count:", hashtags.length);
      } else {
        // Last resort: just extract words that look like they could be hashtags
        hashtags = responseText.match(/\b\w+\b/g)?.slice(0, 8) || [];
        console.log("Last-resort hashtags count:", hashtags.length);
      }
    }
    
    // Final validation
    if (hashtags.length === 0) {
      throw new Error("No hashtags could be extracted");
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
