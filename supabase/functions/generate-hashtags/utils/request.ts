
// Function to extract and validate request data
export async function extractRequestData(req: Request): Promise<{ title: string; content?: string; error?: string }> {
  try {
    const requestData = await req.json();
    const { title, content } = requestData;
    
    if (!title) {
      return { title: '', error: "Missing title in request" };
    }
    
    return { title, content };
  } catch (error) {
    console.error("Error parsing request data:", error);
    return { title: '', error: "Invalid request data" };
  }
}
