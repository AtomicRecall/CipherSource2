// Client-side API key configuration
// This file handles client-side API key access from environment variables
// Works with both local .env.local and Vercel environment variables

// Get API key from environment variable (works on both local and Vercel)
const FACEIT_API_KEY = process.env.NEXT_PUBLIC_FACEIT_API_KEY;

// Make it globally available for legacy code
window.FACEIT_API_KEY = FACEIT_API_KEY;


// Export for modern module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FACEIT_API_KEY };
}
