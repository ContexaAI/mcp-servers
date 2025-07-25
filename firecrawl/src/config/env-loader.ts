import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Get a specific environment variable with warning if not set
 */
export function getEnvVar(key: string, required: boolean = false): string | undefined {
  const value = process.env[key];
  
  if (!value && required) {
    console.warn(`⚠️  Warning: Required environment variable ${key} is not set`);
    console.warn(`   This may cause the server to not function properly`);
  } else if (!value && !required) {
    console.warn(`ℹ️  Info: Optional environment variable ${key} is not set`);
  }
  
  return value;
}

/**
 * Get a specific environment variable with default value
 */
export function getEnvVarWithDefault(key: string, defaultValue: string): string {
  const value = process.env[key];
  
  if (!value) {
    console.warn(`ℹ️  Info: Environment variable ${key} is not set, using default: ${defaultValue}`);
    return defaultValue;
  }
  
  return value;
}

/**
 * Get a numeric environment variable with default value
 */
export function getEnvVarNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  
  if (!value) {
    console.warn(`ℹ️  Info: Environment variable ${key} is not set, using default: ${defaultValue}`);
    return defaultValue;
  }
  
  const numValue = Number(value);
  if (isNaN(numValue)) {
    console.warn(`⚠️  Warning: Environment variable ${key} is not a valid number, using default: ${defaultValue}`);
    return defaultValue;
  }
  
  return numValue;
} 