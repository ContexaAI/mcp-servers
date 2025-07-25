/**
 * Common types used across the FMP API clients
 */

// Define a context type for all client methods
export type FMPContext = {
  config?: {
    FMP_ACCESS_TOKEN?: string;
  };
}; 