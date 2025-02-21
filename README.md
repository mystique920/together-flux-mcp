# Search1API MCP Server

A Model Context Protocol (MCP) server that provides search and crawl functionality using Search1API.

https://github.com/user-attachments/assets/58bc98ae-3b6b-442c-a7fc-010508b5f028


## Features

- Web search functionality
- News search functionality
- Web page content extraction
- Website sitemap extraction
- Seamless integration with Claude Desktop

## Tools

### 1. Search Tool
- Name: `search`
- Description: Search the web using Search1API
- Parameters:
  * `query` (required): Search query
  * `max_results` (optional, default: 10): Number of results to return
  * `search_service` (optional, default: "google"): Search service to use

### 2. News Tool
- Name: `news`
- Description: Search for news articles using Search1API
- Parameters:
  * `query` (required): Search query
  * `max_results` (optional, default: 10): Number of results to return
  * `search_service` (optional, default: "google"): Search service to use

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

## Setup Guide

### 1. Get Search1API Key
1. Register at [Search1API](https://www.search1api.com/?utm_source=mcp)
2. Get your api key and 100 free credits

### 2. Configure 
#### 2.1 Claude Desktop
Update your Claude configuration file (`claude_desktop_config.json`) with the following content:

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

Configuration file location:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

#### 2.2 Cursor
1. Copy the run.template.sh to your file path and rename it to run.sh
2. Add your own Search1API key to the run.sh file
3. Open Cursor Settings to add new MCP server `search1api` with the command `sh ./your_file_path/run.sh`

Read the Cursor MCP Server [Official Documentation](https://docs.cursor.com/context/model-context-protocol#adding-an-mcp-server-to-cursor) to get more information.

#### 2.3 Windsurf
Update your Windsurf configuration file (`mcp_config.json`) with the following content:

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
Read the Windsurf MCP Server [Official Documentation](https://docs.codeium.com/windsurf/mcp) to get more information.

**Notice: After the configuration is done, you can close Windsurf offcial web tools to save your credits**

## Version History

- v0.1.4: Added Cursor and Windsurf configuration guide
- v0.1.3: Added news search functionality
- v0.1.2: Added sitemap functionality
- v0.1.1: Added web crawling functionality
- v0.1.0: Initial release with search functionality

## License

This project is licensed under the MIT License - see the LICENSE file for details.
