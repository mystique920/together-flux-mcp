import { log } from './utils.js';

// Check API key directly from environment variables
const API_KEY = process.env.SEARCH1API_KEY;
log(`Attempting to read SEARCH1API_KEY from environment: ${API_KEY ? 'Found' : 'Not found'}`);

if (!API_KEY) {
  log('SEARCH1API_KEY environment variable is not set or not passed to the process.');
  throw new Error("SEARCH1API_KEY environment variable is required. Please ensure it is set in LibreChat's .env file and passed to the MCP server process.");
} else {
  log('API key found in environment variables');
}

// API configuration
export const API_CONFIG = {
  BASE_URL: 'https://api.search1api.com',
  DEFAULT_QUERY: 'latest news in the world',
  ENDPOINTS: {
    SEARCH: '/search',
    CRAWL: '/crawl',
    SITEMAP: '/sitemap',
    NEWS: '/news',
    REASONING: '/v1/chat/completions',
    TRENDING: '/trending'
  }
} as const;

// Export API key
export { API_KEY };