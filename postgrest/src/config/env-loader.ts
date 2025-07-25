import { readFileSync } from 'node:fs';
import { join } from 'node:path';

interface EnvConfig {
  key: string;
  value: string | null;
  required: boolean;
  label: string;
}

interface LoadedEnvVars {
  [key: string]: string | undefined;
}

/**
 * Load environment variables from JSON config file
 */
export function loadEnvFromConfig(): LoadedEnvVars {
  const envVars: LoadedEnvVars = {};
  
  try {
    // Try to load from the project root env-config.json
    const configPath = join(process.cwd(), 'env-config.json');
    const configContent = readFileSync(configPath, 'utf-8');
    const config: EnvConfig[] = JSON.parse(configContent);
    
    for (const envConfig of config) {
      const envValue = process.env[envConfig.key];
      
      if (!envValue && envConfig.required) {
        console.warn(`⚠️  Warning: Required environment variable ${envConfig.key} is not set`);
        console.warn(`   This may cause the server to not function properly`);
      } else if (!envValue && !envConfig.required) {
        console.warn(`ℹ️  Info: Optional environment variable ${envConfig.key} is not set`);
      } else {
        envVars[envConfig.key] = envValue;
      }
    }
  } catch (error) {
    console.warn('⚠️  Warning: Could not load env-config.json, falling back to direct environment variables');
    console.warn('   Error:', error instanceof Error ? error.message : 'Unknown error');
    
    // Fallback to direct environment variable access
    const fallbackVars = ['POSTGREST_API_URL', 'POSTGREST_API_KEY', 'POSTGREST_SCHEMA'];
    for (const varName of fallbackVars) {
      const value = process.env[varName];
      if (value) {
        envVars[varName] = value;
      } else {
        console.warn(`ℹ️  Info: Environment variable ${varName} is not set`);
      }
    }
  }
  
  return envVars;
}

/**
 * Get a specific environment variable with warning if not set
 */
export function getEnvVar(key: string, required: boolean = false): string | undefined {
  const envVars = loadEnvFromConfig();
  const value = envVars[key];
  
  if (!value && required) {
    console.warn(`⚠️  Warning: Required environment variable ${key} is not set`);
    console.warn(`   This may cause the server to not function properly`);
  } else if (!value && !required) {
    console.warn(`ℹ️  Info: Optional environment variable ${key} is not set`);
  }
  
  return value;
} 