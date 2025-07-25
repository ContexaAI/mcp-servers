import { readFileSync } from 'fs';
import { join } from 'path';

// Helper to validate and extract required environment variables for Dynatrace MCP
export interface DynatraceEnv {
  oauthClientId?: string;
  oauthClientSecret?: string;
  dtPlatformToken?: string;
  dtEnvironment: string;
  slackConnectionId: string;
}

interface EnvConfig {
  key: string;
  value: string | null;
  required: boolean;
  label: string;
}

/**
 * Reads environment variables from JSON format .env file
 */
function readEnvFromJson(): Record<string, string> {
  try {
    const envPath = join(process.cwd(), '.env');
    const envContent = readFileSync(envPath, 'utf8');
    const envConfig: EnvConfig[] = JSON.parse(envContent);
    
    const envVars: Record<string, string> = {};
    envConfig.forEach(config => {
      if (config.value !== null) {
        envVars[config.key] = config.value;
      }
    });
    
    return envVars;
  } catch (error) {
    console.warn('Could not read .env file, falling back to process.env');
    return {};
  }
}

/**
 * Reads and validates required environment variables for Dynatrace MCP.
 * Throws an Error if validation fails.
 */
export function getDynatraceEnv(env: NodeJS.ProcessEnv = process.env): DynatraceEnv {
  // Read from JSON .env file first, then fall back to process.env
  const jsonEnv = readEnvFromJson();
  const oauthClientId = jsonEnv.OAUTH_CLIENT_ID || env.OAUTH_CLIENT_ID;
  const oauthClientSecret = jsonEnv.OAUTH_CLIENT_SECRET || env.OAUTH_CLIENT_SECRET;
  const dtPlatformToken = jsonEnv.DT_PLATFORM_TOKEN || env.DT_PLATFORM_TOKEN;
  const dtEnvironment = jsonEnv.DT_ENVIRONMENT || env.DT_ENVIRONMENT;
  const slackConnectionId = jsonEnv.SLACK_CONNECTION_ID || env.SLACK_CONNECTION_ID || 'fake-slack-connection-id';

  if (!dtEnvironment) {
    throw new Error('Please set DT_ENVIRONMENT environment variable to your Dynatrace Platform Environment');
  }

  if (!oauthClientId && !oauthClientSecret && !dtPlatformToken) {
    throw new Error(
      'Please set either OAUTH_CLIENT_ID and OAUTH_CLIENT_SECRET, or DT_PLATFORM_TOKEN environment variables',
    );
  }

  if (!dtEnvironment.startsWith('https://')) {
    throw new Error(
      'Please set DT_ENVIRONMENT to a valid Dynatrace Environment URL (e.g., https://<environment-id>.apps.dynatrace.com)',
    );
  }

  if (!dtEnvironment.includes('apps.dynatrace.com') && !dtEnvironment.includes('apps.dynatracelabs.com')) {
    throw new Error(
      'Please set DT_ENVIRONMENT to a valid Dynatrace Platform Environment URL (e.g., https://<environment-id>.apps.dynatrace.com)',
    );
  }

  return { oauthClientId, oauthClientSecret, dtPlatformToken, dtEnvironment, slackConnectionId };
}
