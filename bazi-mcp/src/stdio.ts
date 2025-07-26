#!/usr/bin/env node

import { contexaStart } from './contexa-server.js';
import { server } from './mcp.js';

(async () => {
  try {
    await contexaStart(server);
  } catch (error) {
    console.error('Failed to start Contexa MCP server:', error);
    process.exit(1);
  }
})();
