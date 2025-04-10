#!/usr/bin/env node
import { log } from "./utils.js";
import { createServer } from "./server.js";
import { TOGETHER_API_KEY } from "./config.js";

/**
 * Main function - Program entry point
 */
async function main() {
  // Ensure API key exists
  if (!TOGETHER_API_KEY) {
    log("TOGETHER_API_KEY environment variable is not set");
    process.exit(1);
  }

  try {
    log("Starting Together AI Image Generation MCP server");
    const server = createServer();
    
    // Start server
    await server.start();
    log("Server started successfully");
    
    // Handle process exit signals
    setupExitHandlers(server);
  } catch (error) {
    log("Failed to start server:", error);
    process.exit(1);
  }
}

/**
 * Set up process exit signal handlers
 */
function setupExitHandlers(server: any) {
  const exitHandler = async () => {
    log("Shutting down server...");
    await server.stop();
    process.exit(0);
  };

  // Handle various exit signals
  process.on("SIGINT", exitHandler);
  process.on("SIGTERM", exitHandler);
  process.on("SIGUSR1", exitHandler);
  process.on("SIGUSR2", exitHandler);
}

// Start program
main().catch((error) => {
  log("Fatal error:", error);
  process.exit(1);
});
