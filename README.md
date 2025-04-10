⚠️ **Preview Release:** This MCP server is under active development. Expect verbose console logging and potential changes. Not recommended for production use yet.

# Together AI Image Generation MCP Server


A Model Context Protocol (MCP) server that provides image generation functionality using the Together AI API.

## Prerequisites

- Node.js >= 18.0.0
- A valid Together AI API key (See **Setup Guide** below on how to obtain and configure)
- **IMPORTANT:** Access to the Flux 1.1 Pro model requires a Together AI account with **Tier 2** enabled. A valid API key alone is not sufficient.

## Installation (Standalone / General)

1.  **Clone the repository:**
    ```bash
    # Consider renaming the repository if it's a fork or new project
    git clone <your-repository-url>
    cd <your-repository-directory>
    ```

2.  **Configure API Key:** Before building, you need to provide your Together AI API key. See the **Setup Guide** section below for different methods (e.g., using a `.env` file or environment variables).

3.  **Install dependencies and build:**
    ```bash
    npm install
    npm run build
    ```
    *Note: If using the project's `.env` file method for the API key, ensure it exists before this step.*

## Usage (Standalone / General)

Ensure your API key is configured (see **Setup Guide**).

Start the server:
```bash
npm start
```

The server will then be ready to accept connections from MCP clients.

## Setup Guide

### 1. Get Together AI API Key

1.  Obtain an API key from [Together AI](https://api.together.xyz/). (You might need to sign up or check their documentation for specific instructions).
2.  Locate your API key in your Together AI account settings or dashboard.

### 2. Configure API Key

You need to make your API key available to the server. Choose **one** of the following methods:

**Method A: Project `.env` File (Recommended for Standalone or LibreChat)**

This method is required if integrating with the current version of LibreChat (see specific section below).

1.  In the project root directory, create a file named `.env`:
    ```bash
    # In the project directory
    echo "TOGETHER_API_KEY=your_together_api_key_here" > .env
    ```
2.  Replace `your_api_key_here` with your actual key.
3.  Make sure this file exists **before** running `npm install`. The build step might be triggered automatically by `npm install` via the `prepare` script.

**Method B: Environment Variable (Standalone Only)**

Set the `TOGETHER_API_KEY` environment variable before starting the server.

```bash
export TOGETHER_API_KEY="your_together_api_key_here"
# Start the server (adjust command if needed, e.g., node build/index.js)
node build/index.js
```

**Method C: MCP Client Configuration (Advanced)**

Some MCP clients allow specifying environment variables directly in their configuration. This is useful for clients like Cursor, VS Code extensions, etc.

```json
{
  "mcpServers": {
    "together-image-gen": { // Use a descriptive name
      "command": "node", // Assuming direct execution after build
      "args": [
        "/path/to/your/together-image-gen-mcp/build/index.js" // Adjust path as needed
      ],
      "env": {
        "TOGETHER_API_KEY": "YOUR_TOGETHER_API_KEY"
      }
    }
  }
}
```

**Note on Integration:** The specific integration steps (e.g., for LibreChat) might need adjustments based on the client application and how it manages MCP servers. The `.env` file method is often reliable if the server process inherits the environment from where it's launched.

## Example Integration (Conceptual)

This section provides a conceptual guide. Adapt paths and commands based on your specific client (e.g., LibreChat, Cline, Cursor) and setup (Docker, local).

**Overview:**

1.  Ensure the server code is accessible to your client application.
2.  Configure the required `TOGETHER_API_KEY` using the **Project `.env` File method** within this server's directory or via environment variables passed by the client.
3.  Build this server (`npm install` should handle this via the `prepare` script).
4.  Configure your MCP client to run this server, providing the correct command, arguments, and environment variables (like `TOGETHER_API_KEY`).

**Step-by-Step:**

1.  **Clone the Repository:**
    Navigate to the directory on your host machine where you manage external services for LibreChat (this is often alongside your `docker-compose.yml`). A common location is a dedicated `mcp-server` directory.
    ```bash
    # Example: Navigate to where docker-compose.yml lives, then into mcp-server
    # Example: Navigate to where you store MCP servers
    cd /path/to/your/mcp-servers
    git clone <your-repository-url> # Clone your adapted repository
    ```

2.  **Navigate into the Server Directory:**
    ```bash
    cd <your-repository-directory>
    ```

3.  **Configure API Key (Project `.env` File Method):**
    ```bash
    # Create the .env file
    echo "TOGETHER_API_KEY=your_together_api_key_here" > .env
    # IMPORTANT: Replace 'your_together_api_key_here' with your actual Together AI key
    ```

4.  **Install Dependencies and Build:**
    This step compiles the server code into the `build` directory.
    ```bash
    npm install
    npm run build
    ```

5.  **Configure MCP Client (Example: `librechat.yaml`):**
    Edit your client's configuration file. Add an entry for this server:
    ```yaml
    # Example for librechat.yaml
    mcp_servers:
      together-image-gen: # Use a descriptive name
        # Optional: Display name for the server in the UI
        # name: Together AI Image Gen

        # Command tells the client how to run the server
        command: node

        # Args specify the script for 'node' to run *inside the container/environment*
        args:
          # Adjust this path based on your volume mapping / setup
          - /app/mcp-servers/<your-repository-directory>/build/index.js
    ```
    *   The `args` path (`/app/...`) is the location *inside* the LibreChat API container where the built server will be accessed (thanks to the volume bind in the next step).

6.  **Configure Docker Volume Bind (If using Docker):**
    If your client runs in Docker, map the server directory from your host into the container. Edit your `docker-compose.yml` or `docker-compose.override.yml`:
    ```yaml
    # Example for docker-compose.yml
    services:
      your_client_service: # e.g., api for LibreChat
        # ... other service config ...
        volumes:
          # ... other volumes ...

          # Add this volume bind (adjust paths):
          - ./mcp-servers/<your-repository-directory>:/app/mcp-servers/<your-repository-directory>
    ```
    *   **Host Path (`./mcp-servers/...`):** Path on your host relative to `docker-compose.yml`.
    *   **Container Path (`:/app/mcp-servers/...`):** Path inside the container. Must align with the path used in the client config (`librechat.yaml` args).

7.  **Restart Client Application:**
    Apply the configuration changes by restarting your client application (e.g., restart Docker containers).

Now, the Together AI Image Generation server should be available as a tool provider within your client.

## Features

- Generates images based on text prompts using the Together AI API.
- Configurable parameters like model, dimensions, steps, etc.
- Integrates with MCP clients (e.g., Cline, LibreChat, Cursor).
## Tool: `image_generation`

- **Description:** Generates images based on a text prompt using the Together AI API.
- **Parameters:**
  * `model` (required, string): The model ID to use (e.g., "stabilityai/stable-diffusion-xl-1024-v1.0").
  * `prompt` (required, string): The text prompt to guide image generation.
  * `width` (optional, integer, default: 1024): Image width in pixels.
  * `height` (optional, integer, default: 1024): Image height in pixels.
  * `steps` (optional, integer, default: 20): Number of diffusion steps.
  * `n` (optional, integer, default: 1): Number of images to generate.
  * `seed` (optional, integer): Seed for reproducibility.
  * `response_format` (optional, string, default: 'b64_json'): Format for returned images ('url' or 'b64_json').
  * `stop` (optional, array of strings): Sequences to stop generation at.
## Version History

- v0.1.0 (Refactored): Initial version focused on Together AI image generation. Adapted from search1api-mcp v0.2.0.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
