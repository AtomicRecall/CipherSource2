// Centralized API configuration for FACEIT API
// This file handles API key access for both server-side and client-side
// Works with both local .env.local and Vercel environment variables

// Server-side API key (from .env.local or Vercel environment variables)
export const FACEIT_API_KEY = process.env.FACEIT_API_KEY;

// Client-side API key (from .env.local or Vercel environment variables with NEXT_PUBLIC_ prefix)
export const FACEIT_API_KEY_CLIENT = process.env.NEXT_PUBLIC_FACEIT_API_KEY;

// Get the appropriate API key based on environment
export const getFaceitApiKey = (): string => {
  // In server-side context, use server key
  if (typeof window === 'undefined') {
    return FACEIT_API_KEY;
  }
  
  // In client-side context, use client key
  return FACEIT_API_KEY_CLIENT;
};

// Get authorization headers for FACEIT API
export const getFaceitHeaders = (): Record<string, string> => {
  const apiKey = getFaceitApiKey();
  
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

