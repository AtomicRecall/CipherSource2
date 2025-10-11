
export const getFaceitHeaders = (): Record<string, string> => {
  const apiKey = "503892e2-2d7b-4373-ab3e-69f53a6acdd3";

  return {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };
};

