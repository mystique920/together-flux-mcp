import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { log } from './utils.js';

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to load .env from multiple locations
const envPaths = [
  // Docker environment (when running as a module)
  join(__dirname, '../../.env'),
  // Project root (when running directly)
  join(__dirname, '../.env'),
  // Build directory
  join(__dirname, '.env'),
  // Current working directory (LibreChat's .env)
  join(process.cwd(), '.env')
];

// Try each path until we find one that works
let envLoaded = false;
for (const path of envPaths) {
  const result = dotenv.config({ path });
  if (!result.error) {
    log(`Loaded .env from: ${path}`);
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  log('No .env file found in any of the checked locations');
}

// Check API key
const API_KEY = process.env.SEARCH1API_KEY;

if (!API_KEY) {
  log('API key not found in environment variables');
  throw new Error("SEARCH1API_KEY environment variable is required. Please set it in your .env file or environment variables.");
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