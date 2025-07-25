import { config } from 'dotenv';
import { statSync } from 'fs';
import './test/extensions.js';
import { getEnvVar } from './src/config/env-loader.js';

// Check CI environment variable with warning
const ciEnv = getEnvVar('CI', false);
if (!ciEnv) {
  console.warn('ℹ️  Info: CI environment variable is not set');
}

// Try to load .env.local if not in CI
if (!ciEnv) {
  try {
    const envPath = '.env.local';
    statSync(envPath);
    config({ path: envPath });
  } catch (error) {
    console.warn('ℹ️  Info: .env.local file not found, using default configuration');
  }
}
