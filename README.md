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

1. Clone the repository into your LibreChat's MCP server directory:
```bash
cd /path/to/librechat/mcp-server
git clone https://github.com/mystique920/search1api-mcp.git
```

2. Update your `librechat.yaml` configuration:
```yaml
search1api:
  command: node
  args:
    - /app/mcp-server/search1api-mcp/build/index.js
```

3. Ensure proper volume binds in your Docker Compose file:
```yaml
volumes:
  - ./mcp-server/search1api-mcp:/app/mcp-server/search1api-mcp
```

4. Set up the API key:
   - Create the `.env` file in the cloned repository
   - Add your Search1API key
   - The API key must be set before building the project

5. Rebuild and restart LibreChat:
```bash
docker-compose down
docker-compose up -d
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

You can configure the API key in three ways:

#### Option 1: Using LibreChat's .env file (Recommended for LibreChat users)
1. Add the following line to your LibreChat's `.env` file:
   ```
   SEARCH1API_KEY=your_api_key_here
   ```
2. Restart LibreChat to apply the changes

#### Option 2: Using project's own .env file (Recommended for standalone use)
1. Copy `.env.example` to `.env` in the project root:
   ```bash
   cp .env.example .env
   ```
2. Edit `.env` and add your Search1API key:
   ```
   SEARCH1API_KEY=your_api_key_here
   ```
3. Build the project:
   ```bash
   npm run build
   ```
   This will copy the `.env` file to the build directory.

#### Option 3: Using MCP client configuration
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

Note: When using Option 2, make sure to rebuild the project after updating the `.env` file.

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
