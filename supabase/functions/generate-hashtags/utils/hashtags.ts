
// Function to generate hashtags using Gemini API
export async function generateHashtagsWithGemini(title: string, content: string) {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

  if (!geminiApiKey) {
    console.error("Gemini API key not found");
    throw new Error('Gemini API key not found');
  }

  // Prepare the prompt with clear instructions
  const prompt = `Generate 5 to 8 relevant hashtags based on this title: "${title}" and content: "${content}".
  The hashtags should be relevant to cryptocurrency, blockchain, or tech topics if applicable, but should primarily match the content.
  Do NOT include the # symbol in the hashtags.
  Format your response as a JSON array with only the hashtag words (without # symbol).
  Example response format: ["bitcoin", "crypto", "blockchain", "investment", "technology"]`;

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
            { text: prompt }
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
  console.log("Parsing Gemini response");
  
  // Check if we have a valid response
  if (!geminiResponse.candidates || geminiResponse.candidates.length === 0) {
    console.error("No candidates in Gemini response");
    return getDefaultHashtags();
  }
  
  // Parse the response text to extract the hashtags
  const responseText = geminiResponse.candidates[0].content.parts[0].text;
  console.log("Response text length:", responseText.length);
  
  // Try multiple parsing approaches
  try {
    // Approach 1: Direct JSON parsing
    try {
      // Extract JSON array if the whole response is a JSON string
      const hashtags = JSON.parse(responseText);
      if (Array.isArray(hashtags) && hashtags.length > 0) {
        console.log("Direct JSON parse successful");
        return cleanHashtags(hashtags);
      }
    } catch (e) {
      console.log("Direct JSON parsing failed, trying other methods");
    }
    
    // Approach 2: Extract JSON from markdown code blocks
    let jsonStr = responseText;
    if (responseText.includes('```json')) {
      jsonStr = responseText.split('```json')[1].split('```')[0].trim();
    } else if (responseText.includes('```')) {
      jsonStr = responseText.split('```')[1].split('```')[0].trim();
    }
    
    try {
      const hashtags = JSON.parse(jsonStr);
      if (Array.isArray(hashtags) && hashtags.length > 0) {
        console.log("JSON block parsing successful");
        return cleanHashtags(hashtags);
      }
    } catch (e) {
      console.log("JSON block parsing failed, trying regex");
    }
    
    // Approach 3: Regex to extract array content
    const arrayMatch = responseText.match(/\[(.*?)\]/s);
    if (arrayMatch && arrayMatch[1]) {
      const arrayContent = arrayMatch[1];
      // Parse items separated by commas
      const hashtags = arrayContent
        .split(',')
        .map(item => {
          // Remove quotes, whitespace, and # symbols
          return item.trim().replace(/["']/g, '').replace(/^#/, '');
        })
        .filter(Boolean);
      
      if (hashtags.length > 0) {
        console.log("Regex parsing successful with", hashtags.length, "hashtags");
        return cleanHashtags(hashtags);
      }
    }
    
    // Last resort: Extract words that might be hashtags
    const wordMatch = responseText.match(/\b[a-zA-Z0-9]+\b/g);
    if (wordMatch && wordMatch.length > 0) {
      // Take up to 8 words that are likely hashtags
      const hashtags = wordMatch
        .filter(word => word.length > 2 && !/^\d+$/.test(word))
        .slice(0, 8);
      
      console.log("Word extraction successful with", hashtags.length, "hashtags");
      return cleanHashtags(hashtags);
    }
    
    // If all else fails, return default hashtags
    console.log("All parsing methods failed, using defaults");
    return getDefaultHashtags();
  } catch (e) {
    console.error("Error parsing hashtags:", e);
    return getDefaultHashtags();
  }
}

// Helper function to get default hashtags
function getDefaultHashtags(): string[] {
  return ["crypto", "blockchain", "web3", "token", "airdrop"];
}

// Helper function to clean and normalize hashtags
function cleanHashtags(hashtags: any[]): string[] {
  return hashtags
    .map(tag => {
      if (typeof tag !== 'string') return String(tag);
      return tag.startsWith('#') ? tag.substring(1) : tag;
    })
    .filter(tag => tag.trim().length > 0)
    .slice(0, 8); // Limit to 8 hashtags maximum
}
