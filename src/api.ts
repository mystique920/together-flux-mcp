import { API_KEY, API_CONFIG } from './config.js';
import { log } from './utils.js';

/**
 * Unified API request function
 * @param endpoint API endpoint
 * @param data Request data
 * @returns API response
 */
export async function makeRequest<T>(endpoint: string, data: any): Promise<T> {
  const startTime = Date.now();
  const baseUrl = API_CONFIG.BASE_URL.replace(/\/+$/, '');
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${path}`;

  // Debug log for API key and request details
  log(`Making request to: ${url}`);
  log(`Raw API key: "${API_KEY}"`);
  log(`Authorization header: "Bearer ${API_KEY}"`);
  log(`Request data: ${JSON.stringify(data, null, 2)}`);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    // Log response details
    log(`Response status: ${response.status}`);
    log(`Response headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      log(`Error response: ${JSON.stringify(errorData, null, 2)}`);
      throw new Error(`API error: ${response.status} ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    const duration = Date.now() - startTime;
    log(`API request to ${endpoint} completed in ${duration}ms`);
    log(`Response data: ${JSON.stringify(result, null, 2)}`);

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    log(`API request to ${endpoint} failed after ${duration}ms:`, error);
    throw error;
  }
}