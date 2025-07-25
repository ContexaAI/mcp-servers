import { readFileSync } from 'fs';
import { join } from 'path';

interface EnvVariable {
  key: string;
  value: string | null;
  required: boolean;
  label: string;
}

interface EnvConfig {
  [key: string]: string | null;
}

/**
 * Load environment variables from the JSON structure
 */
export function loadEnvConfig(): EnvConfig {
  try {
    // Try to load from env file first, then fallback to env.example
    let envPath = join(process.cwd(), 'env');
    let envContent: string;
    
    try {
      envContent = readFileSync(envPath, 'utf8');
    } catch {
      // Fallback to env.example
      envPath = join(process.cwd(), 'env.example');
      try {
        envContent = readFileSync(envPath, 'utf8');
      } catch {
        console.warn('No env or env.example file found, using default configuration');
        return {};
      }
    }

    const envVariables: EnvVariable[] = JSON.parse(envContent);
    const config: EnvConfig = {};

    for (const envVar of envVariables) {
      // Check if the environment variable is set in process.env
      const envValue = process.env[envVar.key];
      
      if (envValue !== undefined) {
        config[envVar.key] = envValue;
      } else if (envVar.value !== null) {
        config[envVar.key] = envVar.value;
      } else {
        config[envVar.key] = null;
      }

      // Check if required variables are missing
      if (envVar.required && config[envVar.key] === null) {
        console.warn(`Warning: Required environment variable ${envVar.key} is not set`);
      }
    }

    return config;
  } catch (error) {
    console.error('Error loading environment configuration:', error);
    return {};
  }
}

/**
 * Get a specific environment variable value
 */
export function getEnvValue(key: string): string | null {
  const config = loadEnvConfig();
  return config[key] || null;
}

/**
 * Get proxy configuration from environment variables
 */
export function getProxyFromEnv(): string | undefined {
  const config = loadEnvConfig();
  
  // Check in order of priority: HTTP_PROXY, HTTPS_PROXY, ALL_PROXY
  const httpProxy = config['HTTP_PROXY'] || config['http_proxy'];
  const httpsProxy = config['HTTPS_PROXY'] || config['https_proxy'];
  const allProxy = config['ALL_PROXY'] || config['all_proxy'];
  
  return httpProxy || httpsProxy || allProxy || undefined;
} 