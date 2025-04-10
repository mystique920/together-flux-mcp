# Product Context

This file provides a high-level overview of the project and the expected product that will be created. Initially it is based upon projectBrief.md (if provided) and all other available project-related information in the working directory. This file is intended to be updated as the project evolves, and should be used to inform all other modes of the project's goals and context.
2025-04-10 15:27:23 - Log of updates made will be appended as footnotes to the end of this file.

*

## Project Goal

*   Adapt an existing MCP server codebase to create a dedicated server for interacting solely with the Together AI image generation API, using `TOGETHER_API_KEY` for authentication.

## Key Features

*   Provides a single MCP tool (`image_generation`) to generate images via the Together AI API.
*   Configurable API key loading (environment variable or `.env` file).
*   Standard MCP server functionality (tool listing, resource handling - though minimal resources defined currently).

## Overall Architecture

*   Node.js/TypeScript MCP server using the `@modelcontextprotocol/sdk`.
*   Configuration (`src/config.ts`) loads the `TOGETHER_API_KEY` and API base URL/endpoints.
*   API interaction logic (`src/api.ts`) handles authenticated requests to the Together AI API.
*   Tool definition (`src/tools/image_generation.ts`) defines the schema and handler for the image generation functionality.
*   Server setup (`src/server.ts`) registers the tool and handles MCP requests.