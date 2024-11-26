#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ErrorCode,
  McpError
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import dotenv from "dotenv";
import { 
  SearchResponse,
  SearchArgs,
  isValidSearchArgs 
} from "./types.js";

dotenv.config();

const API_KEY = process.env.SEARCH1API_KEY;
if (!API_KEY) {
  throw new Error("SEARCH1API_KEY environment variable is required");
}

const API_CONFIG = {
  BASE_URL: 'https://api.search1api.com',
  DEFAULT_QUERY: 'latest news in the world',
  ENDPOINTS: {
    SEARCH: 'search'
  }
} as const;

class SearchServer {
  private server: Server;
  private axiosInstance;

  constructor() {
    this.server = new Server({
      name: "search1api-mcp",
      version: "0.1.0"
    }, {
      capabilities: {
        resources: {},
        tools: {}
      }
    });

    // Configure axios with defaults
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    this.setupHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error("[MCP Error]", error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupHandlers(): void {
    this.setupResourceHandlers();
    this.setupToolHandlers();
  }

  private setupResourceHandlers(): void {
    this.server.setRequestHandler(
      ListResourcesRequestSchema,
      async () => ({
        resources: [{
          uri: `search://${encodeURIComponent(API_CONFIG.DEFAULT_QUERY)}`,
          name: `Search results for "${API_CONFIG.DEFAULT_QUERY}"`,
          mimeType: "application/json",
          description: "Search results including title, link, and snippet"
        }]
      })
    );

    this.server.setRequestHandler(
      ReadResourceRequestSchema,
      async (request) => {
        const defaultQuery = API_CONFIG.DEFAULT_QUERY;
        if (request.params.uri !== `search://${encodeURIComponent(defaultQuery)}`) {
          throw new McpError(
            ErrorCode.InvalidRequest,
            `Unknown resource: ${request.params.uri}`
          );
        }

        try {
          const response = await this.axiosInstance.post<SearchResponse>(
            API_CONFIG.ENDPOINTS.SEARCH,
            {
              query: defaultQuery,
              search_service: "google",
              max_results: 10
            }
          );

          return {
            contents: [{
              uri: request.params.uri,
              mimeType: "application/json",
              text: JSON.stringify(response.data.results, null, 2)
            }]
          };
        } catch (error) {
          if (axios.isAxiosError(error)) {
            throw new McpError(
              ErrorCode.InternalError,
              `Search API error: ${error.response?.data?.message ?? error.message}`
            );
          }
          throw error;
        }
      }
    );
  }
  
  private setupToolHandlers(): void {
    this.server.setRequestHandler(
      ListToolsRequestSchema,
      async () => ({
        tools: [{
          name: "search1api",
          description: "A fast way to search the world",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Search query"
              }
            },
            required: ["query"]
          }
        }]
      })
    );
  
    this.server.setRequestHandler(
      CallToolRequestSchema,
      async (request) => {
        if (request.params.name !== "search1api") {
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${request.params.name}`
          );
        }
  
        if (!isValidSearchArgs(request.params.arguments)) {
          throw new McpError(
            ErrorCode.InvalidParams,
            "Invalid search arguments"
          );
        }
  
        const { query, max_results = 10, search_service = "google" } = request.params.arguments;
  
        try {
          const response = await this.axiosInstance.post<SearchResponse>(
            API_CONFIG.ENDPOINTS.SEARCH,
            {
              query,
              search_service,
              max_results
            }
          );
  
          return {
            content: [{
              type: "text",
              mimeType: "application/json",
              text: JSON.stringify(response.data.results, null, 2)
            }]
          };
        } catch (error) {
          if (axios.isAxiosError(error)) {
            return {
              content: [{
                type: "text",
                mimeType: "text/plain",
                text: `Search API error: ${error.response?.data?.message ?? error.message}`
              }],
              isError: true
            };
          }
          throw error;
        }
      }
    );
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    console.error("Search1API MCP server running on stdio");
  }
}

const server = new SearchServer();
server.run().catch(console.error);
