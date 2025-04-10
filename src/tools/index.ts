import { Tool } from '@modelcontextprotocol/sdk/types.js'; // Corrected import path and type name
import { image_generation } from './image_generation.js';

// Export the single image generation tool
export const ALL_TOOLS: Tool[] = [ // Corrected type name
  image_generation,
];

// Optionally, export the tool individually if needed elsewhere
export { image_generation };