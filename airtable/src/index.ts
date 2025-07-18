#!/usr/bin/env node

import { config } from 'dotenv';
import { AirtableService } from './airtableService.js';
import { AirtableMCPServer } from './mcpServer.js';
import { contexaStart } from './contexa-server.js';

// Load environment variables
config();

const main = async () => {
  // Get API key from environment variable or command line argument (deprecated)
  const envApiKey = process.env.AIRTABLE_API_KEY;
  const argApiKey = process.argv.slice(2)[0];
  
  const apiKey = envApiKey || argApiKey;
  
  if (!apiKey) {
    console.error('Error: AIRTABLE_API_KEY environment variable is required.');
    console.error('Please set AIRTABLE_API_KEY in your .env file or environment variables.');
    console.error('Get your token from: https://airtable.com/create/tokens');
    process.exit(1);
  }
  
  if (argApiKey && !envApiKey) {
    // Deprecation warning only if using command line argument
    console.warn('warning (airtable-mcp-server): Passing in an API key as a command-line argument is deprecated and may be removed in a future version. Instead, set the `AIRTABLE_API_KEY` environment variable. See https://github.com/domdomegg/airtable-mcp-server/blob/master/README.md#usage for an example with Claude Desktop.');
  }
  
  if (envApiKey) {
    console.log('✅ Using AIRTABLE_API_KEY from environment variables');
  }
  
  try {
    const airtableService = new AirtableService(apiKey);
    const mcpServer = new AirtableMCPServer(airtableService);
    await contexaStart(mcpServer.mcpServer);
  } catch (error) {
    console.error('Failed to start Contexa server:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
