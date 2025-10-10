
export const getFaceitHeaders = (): Record<string, string> => {
  const apiKey = "503892e2-2d7b-4373-ab3e-69f53a6acdd3";
  
  if (!apiKey) {
    const isServer = typeof window === 'undefined';
    const envVar = isServer ? 'FACEIT_API_KEY' : 'NEXT_PUBLIC_FACEIT_API_KEY';
    const location = isServer ? 'Vercel environment variables or .env.local' : 'Vercel environment variables or .env.local';
    throw new Error(`FACEIT API key not found. Please set ${envVar} in ${location}`);
  }
  
  return {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };
};

