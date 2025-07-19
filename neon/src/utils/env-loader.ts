import fs from 'node:fs';
import path from 'node:path';

interface EnvVariable {
  key: string;
  value: string;
  required: boolean;
  label: string;
  description: string;
}

/**
 * Load environment variables from JSON format .env file
 */
export function loadJsonEnv(envPath: string = '.env'): void {
  try {
    if (!fs.existsSync(envPath)) {
      return; // No .env file, skip
    }

    const content = fs.readFileSync(envPath, 'utf8');
    
    // Try to parse as JSON first
    let envVars: EnvVariable[];
    try {
      envVars = JSON.parse(content);
    } catch {
      // If not JSON, assume it's standard .env format and let dotenv handle it
      return;
    }

    // Set environment variables from JSON format
    envVars.forEach((envVar) => {
      if (envVar.value && !process.env[envVar.key]) {
        process.env[envVar.key] = envVar.value;
      }
    });

    console.log(`✅ Loaded ${envVars.length} environment variables from JSON format`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn(`Warning: Could not load JSON environment file: ${errorMessage}`);
  }
}

/**
 * Get environment variable value from JSON .env file or process.env
 */
export function getEnvVar(key: string, defaultValue?: string): string | undefined {
  return process.env[key] || defaultValue;
}

/**
 * Validate required environment variables from JSON .env file
 */
export function validateRequiredEnvVars(envPath: string = '.env'): void {
  try {
    if (!fs.existsSync(envPath)) {
      return;
    }

    const content = fs.readFileSync(envPath, 'utf8');
    let envVars: EnvVariable[];
    
    try {
      envVars = JSON.parse(content);
    } catch {
      return; // Not JSON format, skip validation
    }

    const missingRequired = envVars
      .filter(envVar => envVar.required && !process.env[envVar.key])
      .map(envVar => envVar.key);

    if (missingRequired.length > 0) {
      console.error(`❌ Missing required environment variables: ${missingRequired.join(', ')}`);
      console.error('Please set these variables in your .env file or environment');
      process.exit(1);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn(`Warning: Could not validate environment variables: ${errorMessage}`);
  }
}
