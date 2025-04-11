import { Tool, ToolSchema } from '@modelcontextprotocol/sdk/types.js';
import { makeRequest } from '../api.js';
import { API_CONFIG } from '../config.js';
import { log } from '../utils.js';

// Define the input schema based on Together AI API parameters
const imageGenerationInputSchema = {
  type: 'object',
  properties: {
    model: {
      type: 'string',
      description: 'The ONLY supported model is "black-forest-labs/FLUX.1.1-pro". Any other value will be ignored.',
    },
    prompt: {
      type: 'string',
      description: 'The text prompt to guide image generation.',
    },
    width: {
      type: 'integer',
      description: 'The width of the generated image in pixels.',
      default: 1024,
    },
    height: {
      type: 'integer',
      description: 'The height of the generated image in pixels.',
      default: 1024,
    },
    steps: {
      type: 'integer',
      description: 'Number of diffusion steps.',
      default: 20,
    },
    n: {
      type: 'integer',
      description: 'Number of images to generate.',
      default: 1,
    },
    seed: {
      type: 'integer',
      description: 'Seed for reproducibility.',
    },
    response_format: {
      type: 'string',
      description: 'The format in which the generated images are returned.',
      default: 'b64_json',
      enum: ['url', 'b64_json'],
    },
    stop: {
      type: 'array',
      items: { type: 'string' },
      description: 'Up to 4 sequences where the API will stop generating further tokens.',
    },
  },
  required: ['model', 'prompt'],
} as const; // Add 'as const' for literal type inference

// Define the output schema (adjust based on actual API response structure)
const imageGenerationOutputSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    created: { type: 'integer' },
    // Assuming 'b64_json' response format
    data: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          b64_json: { type: 'string', description: 'Base64 encoded image data.' },
          // Add other potential fields if needed (e.g., revised_prompt)
        },
        required: ['b64_json'],
      },
    },
    // Add other potential top-level fields if needed
  },
  required: ['id', 'created', 'data'],
} as const; // Add 'as const' for literal type inference


// Define the MCP Tool
export const image_generation: Tool = {
  name: 'image_generation',
  description: 'Generates images based on a text prompt using the Together AI API.',
  inputSchema: imageGenerationInputSchema,
  outputSchema: imageGenerationOutputSchema, // Define or adjust as needed
  handler: async (args: any) => { // Using 'any' for args type temporarily to avoid complex type inference issues, can be refined later
    log('Executing image_generation tool with args:', args);

    // Construct the request body for the Together AI API
    // Only include optional parameters if they are provided in args
    const requestBody: Record<string, any> = {
      model: "black-forest-labs/FLUX.1.1-pro",
      prompt: args.prompt,
      // Use the requested response_format (default to 'url' if not provided)
      response_format: args.response_format || 'url',
    };
    if (args.width !== undefined) requestBody.width = args.width;
    if (args.height !== undefined) requestBody.height = args.height;
    if (args.steps !== undefined) requestBody.steps = args.steps;
    if (args.n !== undefined) requestBody.n = args.n;
    if (args.seed !== undefined) requestBody.seed = args.seed;
    if (args.stop !== undefined) requestBody.stop = args.stop;


    try {
      // Explicitly type the expected response structure based on the output schema
      // Define a more flexible response data item type
      interface ResponseDataItem {
        b64_json?: string; // Optional base64 data
        url?: string;      // Optional URL
        // Add other potential fields like revised_prompt if needed
      }
      interface ImageGenerationResponse {
        id: string;
        created: number;
        data: Array<ResponseDataItem>;
        // Add other potential top-level fields if needed
      }

      const response = await makeRequest<ImageGenerationResponse>(
        API_CONFIG.ENDPOINTS.IMAGE_GENERATION,
        requestBody
      );

      log('Together AI API response received.');
      // Basic validation/transformation can happen here if needed
      // For now, directly return the parsed response assuming it matches the output schema
      // Construct the response according to MCP standard (content array)
      // Import dependencies at the top of the handler
      const fs = await import('fs');
      const path = await import('path');
      const { default: axios } = await import('axios');
      const crypto = await import('crypto');

      // Use Promise.all to handle async map
      const content = await Promise.all(response.data.map(async (item) => {
        if (item.url) {
          // Download the image and save it to ./images
          // Use user/session ID from args, fallback to 'default' if not provided
          const userId = args.user_id || 'default';
          // Save to the same directory as native image tools for LibreChat
          const imagesDir = path.resolve('/app/client/public/images', userId);
          if (!fs.existsSync(imagesDir)) {
            fs.mkdirSync(imagesDir, { recursive: true });
          }
          // Ensure user directory exists
          if (!fs.existsSync(imagesDir)) {
            fs.mkdirSync(imagesDir, { recursive: true });
          }
          // Generate a unique filename
          const ext = path.extname(item.url.split('?')[0]) || '.png';
          const filename = `img_${crypto.randomBytes(8).toString('hex')}${ext}`;
          const filePath = path.join(imagesDir, filename);

          try {
            const response = await axios({
              method: 'get',
              url: item.url,
              responseType: 'arraybuffer'
            });
            fs.writeFileSync(filePath, response.data);
            // Return the local file path as a plain path for LibreChat rendering
            return {
              type: 'text',
              text: `/images/${userId}/${filename}`
            };
          } catch (err) {
            return {
              type: 'text',
              text: `Error downloading image from URL: ${item.url}`
            };
          }
        }
        // Fallback: error message if no image data found
        return {
          type: 'text',
          text: 'Error: No image URL found in response item'
        };
      }));

      return { content };

    } catch (error: any) {
      log('Error calling Together AI API:', error);
      // Re-throw or format the error for MCP response
      throw new Error(`Failed to generate image: ${error.message || 'Unknown API error'}`);
    }
  },
};