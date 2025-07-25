#!/usr/bin/env node

import { parseArgs } from 'node:util';
import { createPostgrestMcpServer } from './server.js';
import { contexaStart } from './contexa-server.js';
import { getEnvVar } from './config/env-loader.js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function main() {
  const {
    values: { apiUrl: cliApiUrl, apiKey: cliApiKey, schema: cliSchema },
  } = parseArgs({
    options: {
      apiUrl: {
        type: 'string',
      },
      apiKey: {
        type: 'string',
      },
      schema: {
        type: 'string',
      },
    },
  });

  // Load environment variables with warnings but don't exit if missing
  const apiUrl = cliApiUrl || getEnvVar('POSTGREST_API_URL', false);
  const apiKey = cliApiKey || getEnvVar('POSTGREST_API_KEY', false);
  const schema = cliSchema || getEnvVar('POSTGREST_SCHEMA', false);

  if (!apiUrl) {
    console.warn('⚠️  Warning: POSTGREST_API_URL is not set');
    console.warn('   The server will start but may not function properly without API URL');
    console.warn('   You can set it via --apiUrl flag or POSTGREST_API_URL environment variable');
  }

  if (!schema) {
    console.warn('⚠️  Warning: POSTGREST_SCHEMA is not set');
    console.warn('   The server will start but may not function properly without schema');
    console.warn('   You can set it via --schema flag or POSTGREST_SCHEMA environment variable');
  }

  console.log('🔧 PostgREST MCP Server Configuration:');
  console.log(`   API URL: ${apiUrl || 'not set'}`);
  console.log(`   Schema: ${schema || 'not set'}`);
  console.log(`   API Key: ${apiKey ? '***configured***' : 'not provided'}`);

  const server = createPostgrestMcpServer({
    apiUrl: apiUrl || '', // Provide empty string as fallback
    apiKey: apiKey || '', // Provide empty string as fallback
    schema: schema || '', // Provide empty string as fallback
  });

  await contexaStart(server);
}

main().catch(console.error);
