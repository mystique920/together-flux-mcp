/**
 * Logging utility function
 */
export function log(message: string, ...args: any[]) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ${message}`, ...args);
}

/**
 * Error formatting utility function
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}