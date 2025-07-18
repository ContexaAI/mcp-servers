#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { contexaStart } from './dist/contexa-server.js';
import dotenv from 'dotenv';

dotenv.config();

// Create a minimal server for testing
const server = new Server(
  {
    name: 'firecrawl-mcp-test',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      logging: {},
    },
  }
);

// Simple startup test
async function testServer() {
  try {
    console.log('🧪 Testing Firecrawl MCP Server startup...');
    console.log('📦 Environment loaded');
    console.log('🚀 Starting Contexa transport...');
    
    // Start the server using contexa transport
    await contexaStart(server);
    
    console.log('✅ Server started successfully!');
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

testServer();
