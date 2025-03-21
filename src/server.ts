import {
  Server
} from "@modelcontextprotocol/sdk/server/index.js"; 
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { 
  McpError, 
  ErrorCode,
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListToolsRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
import { handleToolCall } from "./tools/handlers.js";
import { log, formatError } from "./utils.js";
import { handleListResources, handleReadResource } from "./resources.js";
import { ALL_TOOLS } from "./tools/index.js";

/**
 * Create and configure MCP server
 */
export function createServer() {
  log("Creating Search1API MCP server");

  // Create server instance
  const server = new Server({
    name: "search1api-server",
    version: "1.0.0"
  }, {
    capabilities: {
      resources: {},
      tools: {}
    }
  });

  // Set up request handlers
  setupRequestHandlers(server);

  // Create STDIO transport
  const transport = new StdioServerTransport();

  return {
    start: async () => {
      // Connect transport
      log("Connecting to transport...");
      try {
        await server.connect(transport);
        log("Successfully connected to transport");
      } catch (error) {
        log("Error connecting to transport:", error);
        throw error;
      }
    },
    stop: async () => {
      // Close server
      log("Stopping server...");
      try {
        await server.close();
        log("Server stopped successfully");
      } catch (error) {
        log("Error stopping server:", error);
        throw error;
      }
    }
  };
}

/**
 * Set up server request handlers
 */
function setupRequestHandlers(server: Server) {
  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      const toolName = request.params.name;
      const toolArgs = request.params.arguments;
      
      log(`Tool call received: ${toolName}`);
      return await handleToolCall(toolName, toolArgs);
    } catch (error) {
      log(`Error handling tool call:`, error);
      
      if (error instanceof McpError) {
        throw error;
      }
      
      throw new McpError(
        ErrorCode.InternalError,
        `Tool execution error: ${formatError(error)}`
      );
    }
  });

  // Handle resource listing
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    try {
      return { resources: handleListResources() };
    } catch (error) {
      log("Error handling list resources:", error);
      
      if (error instanceof McpError) {
        throw error;
      }
      
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to list resources: ${formatError(error)}`
      );
    }
  });

  // Handle resource reading
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    try {
      const resourceUri = request.params.uri;
      const resource = handleReadResource(resourceUri);
      
      return {
        contents: [{
          uri: resourceUri,
          mimeType: resource.mimeType || "application/json",
          text: JSON.stringify(resource)
        }]
      };
    } catch (error) {
      log(`Error handling read resource:`, error);
      
      if (error instanceof McpError) {
        throw error;
      }
      
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to read resource: ${formatError(error)}`
      );
    }
  });

  // Handle tool listing
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: ALL_TOOLS };
  });

  // Handle global errors
  process.on("uncaughtException", (error) => {
    log("Uncaught exception:", error);
  });

  process.on("unhandledRejection", (reason) => {
    log("Unhandled rejection:", reason);
  });
}