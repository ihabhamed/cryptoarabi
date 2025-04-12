
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./utils/cors.ts";
import { isValidToken, validateAuthentication } from "./utils/auth.ts";
import { extractRequestData } from "./utils/request.ts";
import { generateHashtagsWithGemini, parseHashtagsResponse } from "./utils/hashtags.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Log request info for debugging
    console.log(`Request method: ${req.method}`);
    console.log("Request headers received:", Array.from(req.headers.entries())
      .filter(([key]) => !['authorization', 'apikey'].includes(key.toLowerCase()))
      .map(([key]) => key));
    
    // Validate authentication
    const authResult = validateAuthentication(req.headers);
    if (!authResult.isAuthenticated) {
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
    
    // Extract request data
    const { title, content, error } = await extractRequestData(req);
    if (error) {
      return new Response(
        JSON.stringify({ error }),
        { 
          status: 400, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }
    
    console.log("Processing request for hashtags with:", { 
      title: title.substring(0, Math.min(30, title.length)) + (title.length > 30 ? "..." : ""),
      contentLength: content ? content.length : 0
    });

    try {
      // Generate hashtags using Gemini API
      const response = await generateHashtagsWithGemini(title, content || '');
      console.log("Gemini API response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        console.error("Gemini API error:", errorText);
        
        // Return fallback hashtags on API error
        return new Response(
          JSON.stringify({ 
            hashtags: ["crypto", "blockchain", "web3", "token", "airdrop"],
            note: "Using fallback hashtags due to Gemini API error"
          }),
          { 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        );
      }

      const geminiResponse = await response.json();
      console.log("Gemini response received");
      
      // Parse and validate hashtags from the response
      const hashtags = parseHashtagsResponse(geminiResponse);
      
      return new Response(
        JSON.stringify({ hashtags }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    } catch (apiError) {
      console.error("Error calling Gemini API:", apiError);
      
      // Return fallback hashtags on API error
      return new Response(
        JSON.stringify({ 
          hashtags: ["crypto", "blockchain", "web3", "token", "airdrop"],
          note: "Using fallback hashtags due to API error"
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }
  } catch (error) {
    console.error("Error in generate-hashtags function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        hashtags: ["crypto", "blockchain", "web3", "token", "airdrop"],
        note: "Using fallback hashtags due to error"
      }),
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
