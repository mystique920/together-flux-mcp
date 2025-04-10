import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { log } from './utils.js';

// Check API key directly from environment variables first
let TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;
log(`Attempting to read TOGETHER_API_KEY from environment: ${TOGETHER_API_KEY ? 'Found' : 'Not found'}`);

// If not found in env, try loading from .env file in project root as fallback
if (!TOGETHER_API_KEY) {
  log('TOGETHER_API_KEY not found in environment, attempting to load from .env file in project root...');
  // Explicitly define the expected path within the container based on volume mount
  // This avoids potential issues with __dirname resolution in the container environment
  const expectedProjectRoot = '/app/mcp-servers/together-flux-mcp'; // Adjust if your mount point differs
  const projectRootEnvPath = join(expectedProjectRoot, '.env');
  log(`[DEBUG] Using explicit project root path for .env: ${projectRootEnvPath}`);

  log(`Attempting to load .env from: ${projectRootEnvPath}`);
  const result = dotenv.config({ path: projectRootEnvPath });

  if (result.error) {
    log(`Failed to load .env from ${projectRootEnvPath}: ${result.error.message}`);
  } else if (result.parsed && result.parsed.TOGETHER_API_KEY) {
    TOGETHER_API_KEY = result.parsed.TOGETHER_API_KEY;
    log(`Successfully loaded TOGETHER_API_KEY from ${projectRootEnvPath}`);
  } else {
    log(`.env file found at ${projectRootEnvPath}, but TOGETHER_API_KEY was not inside.`);
  }
}

// Final check
if (!TOGETHER_API_KEY) {
  log('TOGETHER_API_KEY could not be found in environment variables or the project root .env file.');
  throw new Error("TOGETHER_API_KEY is required. Set it in your environment variables or place a .env file in the project root.");
} else {
  log('API key located successfully.');
}

// API configuration
export const API_CONFIG = {
  BASE_URL: 'https://api.together.xyz',
  // DEFAULT_QUERY: 'latest news in the world', // Removed as it's not relevant for image generation
  ENDPOINTS: {
    IMAGE_GENERATION: '/v1/images/generations'
    // Removed old endpoints: SEARCH, CRAWL, SITEMAP, NEWS, REASONING, TRENDING
  }
} as const;

// Export API key
export { TOGETHER_API_KEY };