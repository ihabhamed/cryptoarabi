
// Function to generate hashtags using Gemini API
export async function generateHashtagsWithGemini(title: string, content: string) {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

  if (!geminiApiKey) {
    console.error("Gemini API key not found");
    throw new Error('Gemini API key not found');
  }

  return fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
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
}

// Function to parse and extract hashtags from the Gemini API response
export function parseHashtagsResponse(geminiResponse: any): string[] {
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
  
  let hashtags: string[] = [];
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
  
  return hashtags;
}
