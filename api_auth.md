# API Authentication Documentation

This document outlines how API key authentication is handled in the `together-flux-mcp` project.

## Summary

The project uses a Bearer token authentication scheme for its API calls to `https://api.together.xyz`. A single API key (`TOGETHER_API_KEY`) is loaded during application startup and automatically included in the `Authorization` header of all outgoing requests made through a centralized function.

## Details

### 1. Key Loading and Configuration (`src/config.ts`)

*   **Key Variable:** The API key is expected to be available under the name `TOGETHER_API_KEY`.
*   **Loading Mechanism:**
    *   The application first attempts to read the key from the system's environment variables (`process.env.TOGETHER_API_KEY`).
    *   If not found in the environment, it attempts to load the key from a `.env` file located in the project's root directory.
*   **Requirement:** The application requires this key to start. If it's not found via either method, an error is thrown.
*   **Export:** The successfully loaded `API_KEY` is exported for use elsewhere.
*   **API Endpoint:** The base URL for the API is configured as `https://api.together.xyz` within the exported `API_CONFIG` object.

### 2. Authentication in API Requests (`src/api.ts`)

*   **Centralized Function:** All API interactions are routed through the `makeRequest` function.
*   **Header Injection:** This function is responsible for adding the authentication header to every request.
*   **Authentication Scheme:** It uses the `Authorization` header with the `Bearer` scheme. The exact header added is:
    ```
    Authorization: Bearer <loaded_TOGETHER_API_KEY>
    ```
    Where `<loaded_TOGETHER_API_KEY>` is the value obtained during the configuration step.

## Security Note

The current implementation relies on securely managing the `TOGETHER_API_KEY` either through environment variables or the `.env` file. Ensure the `.env` file is included in `.gitignore` and not committed to version control.