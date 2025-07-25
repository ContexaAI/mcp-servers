import fs from 'node:fs';

type EnvVariable = {
  key: string;
  value: string | null;
  required: boolean;
  label: string;
};

/**
 * Load environment variables from JSON format .env file
 */
export function loadJsonEnv(envPath = '.env'): void {
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
      if (envVar.value !== null && !process.env[envVar.key]) {
        process.env[envVar.key] = envVar.value;
      }
    });

    // Silently loaded - console output interferes with tools export
    // console.log(`✅ Loaded ${envVars.length} environment variables from JSON format`);
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
export function validateRequiredEnvVars(envPath = '.env'): void {
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
      console.warn('Server will continue with default values for missing environment variables');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn(`Warning: Could not validate environment variables: ${errorMessage}`);
  }
}
