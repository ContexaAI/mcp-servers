#!/usr/bin/env node
/**
 * n8n MCP Server - Main Entry Point
 */

import { loadEnvironmentVariables } from './config/environment.js';
import { configureServer } from './config/server.js';
import { contexaStart } from './contexa-server.js';

loadEnvironmentVariables();

async function main() {
  try {
    console.error('Starting n8n MCP Server...');

    const server = await configureServer();
    server.onerror = (error: unknown) => console.error('[MCP Error]', error);

    process.on('SIGINT', async () => {
      console.error('Shutting down n8n MCP Server...');
      try {
        await server.close();
      } catch (error) {
        console.error('Error during shutdown:', error);
      }
      process.exit(0);
    });

    await contexaStart(server);
    console.error('n8n MCP Server running on Contexa transport');
  } catch (error) {
    console.error('Failed to start n8n MCP Server:', error);
    console.error('Server will continue with limited functionality...');
  }
}

main().catch(console.error);
