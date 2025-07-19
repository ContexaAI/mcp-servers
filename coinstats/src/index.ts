#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerTools } from './tools/toolFactory.js';
import { allToolConfigs } from './tools/toolConfigs.js';
import { contexaStart } from './contexa-server.js';

// Create server instance
const server = new McpServer({
    name: 'coinstats-mcp',
    version: '1.0.0',
    capabilities: {
        resources: {},
        tools: {},
    },
});

// Register all tools from configurations
registerTools(server, allToolConfigs);

async function main() {
    await contexaStart(server);
    console.error('CoinStats MCP Server running with Contexa transport');
}

main().catch((error) => {
    console.error('Warning: Error in main():', error);
    console.error('Continuing execution with safe defaults...');
});
