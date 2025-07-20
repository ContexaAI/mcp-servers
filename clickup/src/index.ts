#!/usr/bin/env node

import { configureServer, server } from './server.js';
import { info, error } from './logger.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { contexaStart } from './contexa-server.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

process.on('uncaughtException', (err) => {
  error("Uncaught Exception", { message: err.message, stack: err.stack });
});

process.on('unhandledRejection', (reason, promise) => {
  error("Unhandled Rejection", { reason });
});

async function startContextServer() {
  info('Starting ClickUp MCP Server with Contexa transport...');

  info('Server environment', {
    pid: process.pid,
    node: process.version,
    os: process.platform,
    arch: process.arch,
  });

  info('Configuring server request handlers');
  await configureServer();

  info('Starting Contexa MCP transport');
  await contexaStart(server);

  info('Server startup complete - ready to handle requests');
}

async function main() {
  try {
    await startContextServer();
  } catch (err) {
    error('Error during server startup', {
      message: err.message,
      stack: err.stack,
    });
  }
}

main().catch((err) => {
  error("Unhandled server error", { message: err.message, stack: err.stack });
});

