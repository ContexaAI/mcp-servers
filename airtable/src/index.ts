#!/usr/bin/env node

import { config } from 'dotenv';
import { AirtableService } from './airtableService.js';
import { AirtableMCPServer } from './mcpServer.js';
import { contexaStart } from './contexa-server.js';
import { ENV_VARIABLES, getEnvConfig } from './config.js';

// Load environment variables
config();

const main = async () => {
  // Get environment configuration
  const envConfig = getEnvConfig();
  
  // Get API key from environment variable or command line argument (deprecated)
  const envApiKey = envConfig.AIRTABLE_API_KEY;
  const argApiKey = process.argv.slice(2)[0];
  
  const apiKey = envApiKey || argApiKey;
  
  if (!apiKey) {
    console.warn('⚠️  Warning: AIRTABLE_API_KEY environment variable is not set.');
    console.warn('The server will start but Airtable operations may fail.');
    console.warn('To set up your API key, add AIRTABLE_API_KEY to your .env file or environment variables.');
    console.warn('Get your token from: https://airtable.com/create/tokens');
  } else {
    console.log('✅ Using AIRTABLE_API_KEY from environment variables');
  }
  
  if (argApiKey && !envApiKey) {
    // Deprecation warning only if using command line argument
    console.warn('warning (airtable-mcp-server): Passing in an API key as a command-line argument is deprecated and may be removed in a future version. Instead, set the `AIRTABLE_API_KEY` environment variable. See https://github.com/domdomegg/airtable-mcp-server/blob/master/README.md#usage for an example with Claude Desktop.');
  }
  

  
  // Log environment configuration
  if (envConfig.DEBUG_MODE === 'true') {
    console.log('🔧 Environment Configuration:');
    ENV_VARIABLES.forEach(envVar => {
      const value = envVar.key === 'AIRTABLE_API_KEY' && envConfig[envVar.key] 
        ? `${envConfig[envVar.key]?.substring(0, 8)}...` 
        : envConfig[envVar.key];
      console.log(`   ${envVar.label}: ${value}`);
    });
  }
  
  try {
    const airtableService = new AirtableService(apiKey);
    const mcpServer = new AirtableMCPServer(airtableService);
    await contexaStart(mcpServer.mcpServer);
  } catch (error) {
    console.error('Failed to start Contexa server:', error instanceof Error ? error.message : String(error));
    console.warn('⚠️  Server startup failed, but continuing execution...');
  }
};

main().catch((error) => {
  console.error('Unhandled error:', error);
  console.warn('⚠️  An error occurred, but the process will continue running...');
});
