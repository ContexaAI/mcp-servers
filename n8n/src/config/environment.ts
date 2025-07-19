/**
 * Environment Configuration
 */

import dotenv from 'dotenv';
import findConfig from 'find-config';
import path from 'path';

export const ENV_VARS = {
  N8N_API_URL: 'N8N_API_URL',
  N8N_API_KEY: 'N8N_API_KEY',
  N8N_WEBHOOK_USERNAME: 'N8N_WEBHOOK_USERNAME',
  N8N_WEBHOOK_PASSWORD: 'N8N_WEBHOOK_PASSWORD',
  DEBUG: 'DEBUG',
};

export interface EnvConfig {
  n8nApiUrl: string;
  n8nApiKey: string;
  n8nWebhookUsername?: string;
  n8nWebhookPassword?: string;
  debug: boolean;
}

/**
 * Load environment variables from .env file if present
 */
export function loadEnvironmentVariables(): void {
  const {
    N8N_API_URL,
    N8N_API_KEY,
    N8N_WEBHOOK_USERNAME,
    N8N_WEBHOOK_PASSWORD
  } = process.env;

  if (
    !N8N_API_URL &&
    !N8N_API_KEY &&
    !N8N_WEBHOOK_USERNAME &&
    !N8N_WEBHOOK_PASSWORD
  ) {
    const projectRoot = findConfig('package.json');
    if (projectRoot) {
      const envPath = path.resolve(path.dirname(projectRoot), '.env');
      dotenv.config({ path: envPath });
    }
  }
}

export function getEnvConfig(): EnvConfig {
  const n8nApiUrl = process.env[ENV_VARS.N8N_API_URL];
  const n8nApiKey = process.env[ENV_VARS.N8N_API_KEY];
  const n8nWebhookUsername = process.env[ENV_VARS.N8N_WEBHOOK_USERNAME];
  const n8nWebhookPassword = process.env[ENV_VARS.N8N_WEBHOOK_PASSWORD];
  const debug = process.env[ENV_VARS.DEBUG]?.toLowerCase() === 'true';

  let finalApiUrl = n8nApiUrl;
  let finalApiKey = n8nApiKey;

  if (!n8nApiUrl) {
    console.warn(`Warning: Missing environment variable ${ENV_VARS.N8N_API_URL}, using default: http://localhost:5678/api/v1`);
    finalApiUrl = 'http://localhost:5678/api/v1';
  }

  if (!n8nApiKey) {
    console.warn(`Warning: Missing environment variable ${ENV_VARS.N8N_API_KEY}, using placeholder. API calls will likely fail.`);
    finalApiKey = 'placeholder-api-key';
  }

  // Validate URL format if provided
  if (finalApiUrl) {
    try {
      new URL(finalApiUrl);
    } catch (error) {
      console.warn(`Warning: Invalid URL format for ${ENV_VARS.N8N_API_URL}: ${finalApiUrl}, using default`);
      finalApiUrl = 'http://localhost:5678/api/v1';
    }
  }

  return {
    n8nApiUrl: finalApiUrl!,
    n8nApiKey: finalApiKey!,
    n8nWebhookUsername: n8nWebhookUsername || undefined,
    n8nWebhookPassword: n8nWebhookPassword || undefined,
    debug,
  };
}
