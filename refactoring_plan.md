# Refactoring Plan: Together AI Image Generation MCP

**Goal:** Adapt the existing project structure and authentication pattern to create an MCP server focused solely on interacting with the Together AI image generation API, using a `TOGETHER_API_KEY`.

**Constraint:** Reuse the existing pattern for loading the API key (`src/config.ts`) and making authenticated requests (`src/api.ts`), adapting them for the new API and key.

---

## Phase 1: Adapt Configuration and API Logic

1.  **Modify `src/config.ts`:**
    *   **Rename Key Variable:** Change all instances of `SEARCH1API_KEY` to `TOGETHER_API_KEY` (in loading logic, checks, error messages, and the final export).
    *   **Update Base URL:** Change `API_CONFIG.BASE_URL` from `'https://api.search1api.com'` to `'https://api.together.xyz'`.
    *   **Update Endpoints:** Replace the contents of `API_CONFIG.ENDPOINTS` with a single entry: `IMAGE_GENERATION: '/v1/images/generations'`. Remove old endpoints.

2.  **Modify `src/api.ts`:**
    *   **Update Import:** Change the import from `config.js` to get `TOGETHER_API_KEY` instead of `SEARCH1API_KEY`.
    *   *(No other changes needed as `makeRequest` uses imported key/config dynamically)*.

## Phase 2: Implement New Tool & Cleanup

3.  **Create New Tool File (`src/tools/image_generation.ts`):**
    *   Define the input schema based on Together AI API parameters (`model`, `prompt`, `width`, `height`, `steps`, `n`, `seed`, `response_format`, `stop`).
    *   Create a handler function.
    *   **Use Adapted `makeRequest`:** Import `makeRequest` from `../api.js` and `API_CONFIG` from `../config.js`. Call `makeRequest`, passing `API_CONFIG.ENDPOINTS.IMAGE_GENERATION` and the request body constructed from tool arguments.
    *   Handle the API response (parsing `b64_json`) and errors.

4.  **Integrate New Tool & Remove Old:**
    *   Update `src/tools/index.ts`: Remove exports for old tools, add export for `image_generation` tool.
    *   Update `src/server.ts` (or relevant handler registration): Remove registration of old tools, register only `image_generation`.
    *   Delete old tool files: `src/tools/crawl.ts`, `src/tools/handlers.ts` (if applicable), `src/tools/news.ts`, `src/tools/reasoning.ts`, `src/tools/search.ts`, `src/tools/sitemap.ts`, `src/tools/trending.ts`.

5.  **Update Documentation:**
    *   Modify `README.md` to describe the new purpose (Together AI Image Generation MCP) and `TOGETHER_API_KEY` configuration.
    *   Update Memory Bank files (`productContext.md`, `activeContext.md`, `progress.md`) to reflect the new project focus.
    *   Update `api_auth.md` to reflect the use of `TOGETHER_API_KEY` and the new base URL.

---

## Diagram: Adapted Flow

```mermaid
graph TD
    A[MCP Client] -- Tool Request (image_generation) --> B(MCP Server / src/server.ts);
    B -- Arguments --> C(New Tool Handler / src/tools/image_generation.ts);

    D[Environment / .env] -- TOGETHER_API_KEY --> E(Adapted Config / src/config.ts);
    E -- TOGETHER_API_KEY & Adapted API_CONFIG --> F(Adapted API Func / src/api.ts);

    C -- Calls makeRequest --> F;
    F -- fetch (POST, Auth Header using TOGETHER_API_KEY) --> G[Together AI API];
    G -- Image Data (b64_json) --> F;
    F -- Result --> C;
    C -- Result --> B;
    B -- Tool Response --> A;