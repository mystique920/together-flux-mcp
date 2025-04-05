# Search1API MCP Server

[中文文档](./README_zh.md)

A Model Context Protocol (MCP) server that provides search and crawl functionality using Search1API.

## Prerequisites

- Node.js >= 18.0.0
- A valid Search1API API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/mystique920/search1api-mcp.git
cd search1api-mcp
```

2. **Important: Set up your API key before building**
   - Create a `.env` file in the project root
   - Add your Search1API key:
   ```
   SEARCH1API_KEY=your_api_key_here
   ```
   - The API key must be set before running `npm install` or `npm run build`

3. Install dependencies and build:
```bash
npm install
npm run build
```

## Usage

Start the server:
```bash
npm start
```

## Integration with LibreChat (Docker)

To integrate with LibreChat using Docker:

1. Clone this repository into your LibreChat's `mcp-server` directory:
   ```bash
   cd /path/to/librechat/mcp-server
   git clone https://github.com/mystique920/search1api-mcp.git
   ```

2. Navigate into the cloned directory:
   ```bash
   cd search1api-mcp
   ```

3. **Set up the API Key (Required for LibreChat):**
   Due to current limitations in how LibreChat passes environment variables to MCP servers, you **must** place your API key in a `.env` file within this project's root directory.
   ```bash
   # Create the .env file
   echo "SEARCH1API_KEY=your_api_key_here" > .env
   # Replace 'your_api_key_here' with your actual key
   ```

4. Install dependencies and build the MCP server:
   ```bash
   npm install
   npm run build
   ```

5. Update your `librechat.yaml` configuration to point to the built server:
   ```yaml
   # librechat.yaml
   mcp_servers:
     search1api:
       # Optional: Display name for the server in LibreChat UI
       # name: Search1API Tools 
       command: node
       args:
         # Path within the container
         - /app/mcp-server/search1api-mcp/build/index.js 
   ```

6. Ensure the volume bind for the MCP server directory exists in your `docker-compose.yml` (or `docker-compose.override.yml`):
   ```yaml
   # In your docker-compose file, under services -> api -> volumes:
   volumes:
     # ... other volumes
     - ./mcp-server/search1api-mcp:/app/mcp-server/search1api-mcp 
     # Ensure the source path matches where you cloned the repo relative to docker-compose
   ```

7. Rebuild and restart LibreChat if necessary (e.g., if you changed `docker-compose.yml`):
   ```bash
   docker compose down && docker compose up -d --build
   ```

## Features

- Web search functionality
- News search functionality
- Web page content extraction
- Website sitemap extraction
- Deep thinking and complex problem solving with DeepSeek R1
- Seamless integration with Claude Desktop, Cursor, Windsurf, Cline and other MCP clients

## Tools

### 1. Search Tool
- Name: `search`
- Description: Search the web using Search1API
- Parameters:
  * `query` (required): Search query in natural language. Be specific and concise for better results
  * `max_results` (optional, default: 10): Number of results to return
  * `search_service` (optional, default: "google"): Search service to use (google, bing, duckduckgo, yahoo, x, reddit, github, youtube, arxiv, wechat, bilibili, imdb, wikipedia)
  * `crawl_results` (optional, default: 0): Number of results to crawl for full webpage content
  * `include_sites` (optional): List of sites to include in search
  * `exclude_sites` (optional): List of sites to exclude from search
  * `time_range` (optional): Time range for search results ("day", "month", "year")

### 2. News Tool
- Name: `news`
- Description: Search for news articles using Search1API
- Parameters:
  * `query` (required): Search query in natural language. Be specific and concise for better results
  * `max_results` (optional, default: 10): Number of results to return
  * `search_service` (optional, default: "bing"): Search service to use (google, bing, duckduckgo, yahoo, hackernews)
  * `crawl_results` (optional, default: 0): Number of results to crawl for full webpage content
  * `include_sites` (optional): List of sites to include in search
  * `exclude_sites` (optional): List of sites to exclude from search
  * `time_range` (optional): Time range for search results ("day", "month", "year")

### 3. Crawl Tool
- Name: `crawl`
- Description: Extract content from a URL using Search1API
- Parameters:
  * `url` (required): URL to crawl

### 4. Sitemap Tool
- Name: `sitemap`
- Description: Get all related links from a URL
- Parameters:
  * `url` (required): URL to get sitemap

### 5. Reasoning Tool
- Name: `reasoning`
- Description: A tool for deep thinking and complex problem solving with fast deepseek r1 model and web search ability(You can change to any other model in search1api website but the speed is not guaranteed)
- Parameters:
  * `content` (required): The question or problem that needs deep thinking

### 6. Trending Tool
- Name: `trending`
- Description: Get trending topics from popular platforms
- Parameters:
  * `search_service` (required): Specify the platform to get trending topics from (github, hackernews)
  * `max_results` (optional, default: 10): Maximum number of trending items to return

## Setup Guide

### 1. Get Search1API Key
1. Register at [Search1API](https://www.search1api.com/?utm_source=mcp)
2. Get your api key and 100 free credits

### 2. Configure

**Note:** The recommended method depends on how you are running the server.

#### Recommended for LibreChat Users:

**Use the project's own `.env` file.** Due to current limitations in LibreChat's handling of environment variables for MCP servers, placing the key directly in the LibreChat main `.env` file is **not currently supported** for this server.

1.  Create a `.env` file in the `search1api-mcp` project root directory:
    ```bash
    # In the search1api-mcp directory
    echo "SEARCH1API_KEY=your_api_key_here" > .env 
    ```
2.  Replace `your_api_key_here` with your actual key.
3.  Build the project if you haven't already:
    ```bash
    npm install && npm run build
    ```

#### Recommended for Standalone Use (Not with LibreChat):

If running the server directly (not as a child process of LibreChat), you can use the project's `.env` file or environment variables.

1.  **Using `.env` file:**
    ```bash
    # In the search1api-mcp directory
    cp .env.example .env
    # Edit .env and add your key
    nano .env 
    npm install && npm run build
    ```
2.  **Using Environment Variable:**
    ```bash
    export SEARCH1API_KEY="your_api_key_here"
    npm start 
    ```

#### Using MCP client configuration (Advanced):

This method works for clients like Cursor, VS Code extensions, etc., that allow direct configuration.

```json
{
  "mcpServers": {
    "search1api": {
      "command": "npx",
      "args": ["-y", "search1api-mcp"],
      "env": {
        "SEARCH1API_KEY": "YOUR_SEARCH1API_KEY"
      }
    }
  }
}
```

## Version History

- v0.1.8: Added X(Twitter) and Reddit search services
- v0.1.7: Added Trending tool for GitHub and Hacker News
- v0.1.6: Added Wikipedia search service
- v0.1.5: Added new search parameters (include_sites, exclude_sites, time_range) and new search services (arxiv, wechat, bilibili, imdb)
- v0.1.4: Added reasoning tool with deepseek r1 and updated the Cursor and Windsurf configuration guide
- v0.1.3: Added news search functionality
- v0.1.2: Added sitemap functionality
- v0.1.1: Added web crawling functionality
- v0.1.0: Initial release with search functionality

## License

This project is licensed under the MIT License - see the LICENSE file for details.
