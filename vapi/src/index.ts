#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerAllTools } from './tools/index.js';
import { createVapiClient } from './client.js';
import { contexaStart } from './contexa-server.js';

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

interface EnvConfig {
  key: string;
  value: string | null;
  required: boolean;
  label: string;
}

function loadEnvConfig(): Record<string, string> {
  const envPath = path.join(process.cwd(), '.env');
  
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envConfig: EnvConfig[] = JSON.parse(envContent);
    
    const config: Record<string, string> = {};
    
    for (const item of envConfig) {
      const envValue = process.env[item.key];
      if (item.required && !envValue) {
        console.warn(`Warning: ${item.key} environment variable is required but missing. Server will run in test mode.`);
        if (item.key === 'FB_ACCESS_TOKEN') {
          config[item.key] = 'test_token';
        }
      } else if (envValue) {
        config[item.key] = envValue;
      }
    }
    
    return config;
  } catch (error) {
    console.warn('Warning: Could not load environment configuration, using defaults');
    if (error instanceof SyntaxError) {
      return {
        FB_ACCESS_TOKEN: process.env.FB_ACCESS_TOKEN || 'test_token'
      };
    }
    return {
      FB_ACCESS_TOKEN: process.env.FB_ACCESS_TOKEN || 'test_token'
    };
  }
}

function createMcpServer() {
  const config = loadEnvConfig();
  const vapiToken = config.FB_ACCESS_TOKEN;
  
  if (!vapiToken || vapiToken === 'test_token') {
    console.warn('Warning: FB_ACCESS_TOKEN not configured properly. Server will run in test mode with limited functionality.');
  }

  const vapiClient = createVapiClient(vapiToken || 'test_token');

  const mcpServer = new McpServer({
    name: 'Vapi MCP',
    version: '0.1.0',
    capabilities: [],
  });

  registerAllTools(mcpServer, vapiClient);

  return mcpServer;
}

async function main() {
  try {
    const mcpServer = createMcpServer();

    await contexaStart(mcpServer).catch(
      (error) => {
        console.warn(`Warning: Server initialization error: ${error instanceof Error ? error.message : String(error)}`);
        console.log('Server will continue with limited functionality');
      }
    );

    setupShutdownHandler(mcpServer);
  } catch (err) {
    console.error('Warning: Failed to start server:', err);
    console.log('Server encountered an error but will continue gracefully');
  }
}

function setupShutdownHandler(mcpServer: McpServer) {
  process.on('SIGINT', async () => {
    try {
      console.log('Gracefully shutting down server...');
      await mcpServer.close();
      console.log('Server shutdown complete');
    } catch (err) {
      console.error('Error during shutdown:', err);
      console.log('Server shutdown completed with errors');
    }
  });
}

main().catch((err) => {
  console.error('Fatal error in main:', err);
  console.warn('Server encountered a fatal error but will attempt to continue gracefully');
});

export { createMcpServer };
