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
      description: 'The model to use for image generation (e.g., "stabilityai/stable-diffusion-xl-1024-v1.0").',
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
      model: args.model,
      prompt: args.prompt,
      response_format: args.response_format ?? 'b64_json', // Ensure default
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
      return {
        content: response.data.map(item => ({
          type: 'text', // Use 'text' type to convey the URL or base64 data as a string
          text: item.url ?? item.b64_json ?? 'Error: No image data found in response item' // Prioritize URL if available
        }))
      };

    } catch (error: any) {
      log('Error calling Together AI API:', error);
      // Re-throw or format the error for MCP response
      throw new Error(`Failed to generate image: ${error.message || 'Unknown API error'}`);
    }
  },
};