# LibreChat Environment Variable Findings for Search1API MCP Server

This document summarizes the investigation into how the Search1API MCP server retrieves its required `SEARCH1API_KEY` when integrated with LibreChat.

## Problem

The MCP server initially failed to retrieve the `SEARCH1API_KEY` when the key was placed only in the main LibreChat `.env` file (`/app/.env` inside the Docker container).

## Investigation Steps & Findings

1.  **Initial Assumption:** We assumed the MCP server (running as a child process of the LibreChat API) would automatically inherit environment variables loaded by LibreChat from its `.env` file.
2.  **File Path Check:** We modified the MCP server's `config.ts` to explicitly look for `/app/.env`. Logs showed this path was checked, but access failed with `ENOENT: no such file or directory`. This was unexpected.
3.  **Working Directory Check:** Added logging confirmed the MCP server child process runs with `/app/api` as its current working directory, not `/app`.
4.  **Environment Inheritance Check:** Added logging to check `process.env.SEARCH1API_KEY` directly at the start of the MCP server process. Logs definitively showed `Inherited SEARCH1API_KEY: Not found`.

## Conclusion

**LibreChat does not currently pass environment variables (specifically `SEARCH1API_KEY`) loaded via its main `.env` file down to the MCP server child processes it spawns.**

This means the MCP server cannot rely on inheriting the key from the parent process's environment.

## Current Workaround

To enable functionality, the MCP server (`config.ts`) has been modified with the following logic:

1.  **Check `process.env.SEARCH1API_KEY` first.** If the variable *is* present (e.g., if LibreChat is updated in the future or the variable is set globally), it will be used.
2.  **If not found in the environment,** it falls back to using `dotenv` to load a `.env` file located in the **root directory of the `search1api-mcp` project itself** (e.g., `/app/mcp-server/search1api-mcp/.env` within the container).

Therefore, to use this MCP server with the current version of LibreChat, you **must** place a `.env` file containing the `SEARCH1API_KEY` in the root of the `search1api-mcp` directory.

## Recommendation for LibreChat Developers

It is recommended that LibreChat be updated to pass necessary environment variables (like API keys required by MCP servers) down to the child processes it spawns. This would provide a cleaner and more standard integration method, aligning with how environment variables are typically managed in containerized applications.

Alternatively, the configuration mechanism for MCP servers within LibreChat could be enhanced to support standard environment variable substitution (e.g., resolving `${VAR_NAME}` from the main environment) within the server's specific `env` block.

## Further Observations (Shell Execution & `env:` Block)

Further testing revealed:

*   **Shell Execution Works:** It's possible to successfully pass environment variables using variable substitution (e.g., `${SEARCH1API_KEY}`) if the MCP server is launched via a shell command invoked by LibreChat, rather than directly via LibreChat's Node.js spawning mechanism. This indicates the environment variables *are* available in the container's shell context.
*   **`env:` Block Limitation:** When configuring an MCP server directly in LibreChat's configuration (e.g., `librechat.yaml`), using the `env:` block to set `SEARCH1API_KEY: ${VAR_FROM_MAIN_ENV}` does *not* perform the variable substitution. It works only if the literal key value is hardcoded. 