#!/usr/bin/env node

import process from 'node:process';
import { BraveMcpServer } from './server.js';

// Check for API key
const BRAVE_API_KEY = process.env.BRAVE_API_KEY;
if (!BRAVE_API_KEY) {
  console.warn('Warning: BRAVE_API_KEY environment variable is not set. Some features may not work properly.');
}

const braveMcpServer = new BraveMcpServer(BRAVE_API_KEY || '');
braveMcpServer.start().catch((error) => {
  console.error('Error starting server:', error);
  process.exit(1);
});
