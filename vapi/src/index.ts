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
        throw new Error(`${item.key} environment variable is required`);
      }
      if (envValue) {
        config[item.key] = envValue;
      }
    }
    
    return config;
  } catch (error) {
    if (error instanceof SyntaxError) {
      // Fallback to traditional .env format
      return {
        FB_ACCESS_TOKEN: process.env.FB_ACCESS_TOKEN || ''
      };
    }
    throw error;
  }
}

function createMcpServer() {
  const config = loadEnvConfig();
  const vapiToken = config.FB_ACCESS_TOKEN;
  
  if (!vapiToken) {
    throw new Error('FB_ACCESS_TOKEN environment variable is required');
  }

  const vapiClient = createVapiClient(vapiToken);

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
        console.log(`Server initialization error: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
      }
    );

    setupShutdownHandler(mcpServer);
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

function setupShutdownHandler(mcpServer: McpServer) {
  process.on('SIGINT', async () => {
    try {
      await mcpServer.close();
      process.exit(0);
    } catch (err) {
      process.exit(1);
    }
  });
}

main().catch((err) => {
  process.exit(1);
});

export { createMcpServer };
