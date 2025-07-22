#!/usr/bin/env node
/**
 * @file Main entry point for the Reddit MCP server
 * @module index
 * 
 * @remarks
 * This is the executable entry point for the Reddit MCP server when run directly.
 * It loads environment variables and starts the HTTP server on the configured port.
 * 
 * The server can be started using:
 * - `npm start` - Production mode
 * - `npm run dev` - Development mode with auto-reload
 * - `node dist/index.js` - Direct execution
 * 
 * Required environment variables:
 * - REDDIT_CLIENT_ID: OAuth2 client ID from Reddit app
 * - REDDIT_CLIENT_SECRET: OAuth2 client secret
 * - JWT_SECRET: Secret for signing JWT tokens
 * 
 * @see {@link https://modelcontextprotocol.io} Model Context Protocol Documentation
 */

import dotenv from 'dotenv';
dotenv.config();

import { contexaStart } from './contexa-server.js';
import { MCPHandler } from './server/mcp.js';

(async () => {
  try {
    const handler = new MCPHandler();
    await contexaStart(handler.getServer());
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
})();
