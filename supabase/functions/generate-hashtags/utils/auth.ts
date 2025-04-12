
// Function to validate token
export const isValidToken = (token: string): boolean => {
  // Check if token is valid
  const expectedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRscGlxa2Jpd2NkeXpwcXF6c2JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0MjE4MzgsImV4cCI6MjA1OTk5NzgzOH0.5KKw0L7Uo-lsFK0ovvhZXh-_LKYGPE9qq2SIE90acvg";
  return token === expectedToken;
};

// Function to validate authentication from request headers
export const validateAuthentication = (headers: Headers): { isAuthenticated: boolean } => {
  const authHeader = headers.get('Authorization');
  const apiKeyHeader = headers.get('apikey');
  
  console.log("Auth header present:", Boolean(authHeader));
  console.log("API key header present:", Boolean(apiKeyHeader));
  
  // Check for authorization header or apikey (use either)
  let isAuthenticated = false;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    isAuthenticated = isValidToken(token);
    console.log("Auth validated via Authorization header:", isAuthenticated);
  } 
  
  if (!isAuthenticated && apiKeyHeader) {
    isAuthenticated = isValidToken(apiKeyHeader);
    console.log("Auth validated via apikey header:", isAuthenticated);
  }
  
  return { isAuthenticated };
};
