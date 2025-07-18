#!/usr/bin/env node

import { parseArgs } from 'node:util';
import { createPostgrestMcpServer } from './server.js';
import { contexaStart } from './contexa-server.js';
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

  // Use CLI arguments first, then fall back to environment variables
  const apiUrl = cliApiUrl || process.env.POSTGREST_API_URL;
  const apiKey = cliApiKey || process.env.POSTGREST_API_KEY;
  const schema = cliSchema || process.env.POSTGREST_SCHEMA;

  if (!apiUrl) {
    console.error('Please provide a base URL with the --apiUrl flag or set POSTGREST_API_URL environment variable');
    process.exit(1);
  }

  if (!schema) {
    console.error('Please provide a schema with the --schema flag or set POSTGREST_SCHEMA environment variable');
    process.exit(1);
  }

  console.log('🔧 PostgREST MCP Server Configuration:');
  console.log(`   API URL: ${apiUrl}`);
  console.log(`   Schema: ${schema}`);
  console.log(`   API Key: ${apiKey ? '***configured***' : 'not provided'}`);

  const server = createPostgrestMcpServer({
    apiUrl,
    apiKey,
    schema,
  });

  await contexaStart(server);
}

main().catch(console.error);
