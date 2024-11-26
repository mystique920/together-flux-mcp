# Search1API MCP Server

A Model Context Protocol (MCP) server that provides search functionality using Search1API.

## Features

- Web search functionality through Search1API
- Seamless integration with Claude Desktop

## Setup Guide

### 1. Get Search1API Key
1. Register at [Search1API](https://www.search1api.com/)
2. Choose a pricing plan (starts from $0.99)
3. After payment, copy your API key from the confirmation email

### 2. Configure Claude Desktop
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

## License

This project is licensed under the MIT License - see the LICENSE file for details.
