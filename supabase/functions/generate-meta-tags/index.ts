
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

    // In a real implementation, you would call the Gemini API here
    // This is a placeholder implementation that does basic processing
    
    // Generate meta title - use the title as is
    const metaTitle = title;
    
    // Generate meta description - truncate the content to 157 chars and add ellipsis
    let metaDescription = '';
    if (content) {
      // Simple summarization: take the first 157 characters and add ellipsis
      metaDescription = content.substring(0, 157) + '...';
    }
    
    return new Response(
      JSON.stringify({
        metaTitle,
        metaDescription
      }),
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
