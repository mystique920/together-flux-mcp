import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to load .env from multiple locations
const envPaths = [
  // LibreChat's .env file (if running within LibreChat)
  join(process.cwd(), '.env'),
  // Project's own .env file
  join(__dirname, '../.env'),
  // Build directory .env file
  join(__dirname, '.env')
];

// Try each path until we find one that works
for (const path of envPaths) {
  const result = dotenv.config({ path });
  if (!result.error) {
    break;
  }
}

// Check API key
const API_KEY = process.env.SEARCH1API_KEY;

if (!API_KEY) {
  throw new Error("SEARCH1API_KEY environment variable is required. Please set it in your .env file or environment variables.");
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