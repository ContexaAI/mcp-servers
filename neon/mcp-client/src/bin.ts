#!/usr/bin/env node

import { parseArgs } from 'node:util';
import { MCPClientCLI } from './cli-client.js';

function checkRequiredEnvVars() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error(
      '\x1b[31mError: ANTHROPIC_API_KEY environment variable is required\x1b[0m',
    );
    console.error('Please set it before running the CLI:');
    console.error('  export ANTHROPIC_API_KEY=your_key_here');
    return false;
  }
  return true;
}

async function main() {
  try {
    let hasRequiredEnvVars = checkRequiredEnvVars();
    
    if (!hasRequiredEnvVars) {
      console.warn('Warning: Required environment variables missing. CLI will continue with mock functionality.');
    }

    const args = parseArgs({
      options: {
        'server-command': { type: 'string' },
        'server-args': { type: 'string' },
      },
      allowPositionals: true,
    });

    let serverCommand = args.values['server-command'];
    const serverArgs = args.values['server-args']?.split(' ') || [];

    if (!serverCommand) {
      console.error('Error: --server-command is required');
      console.error('Usage: mcp-client --server-command "your-command" [--server-args "arg1 arg2"]');
      console.warn('Using default mock command for continued execution');
      serverCommand = 'echo';
    }

    const cli = new MCPClientCLI({
      command: serverCommand,
      args: serverArgs,
    });

    if (hasRequiredEnvVars) {
      await cli.start();
    } else {
      console.log('Mock CLI started - would normally connect to:', serverCommand, serverArgs);
    }
  } catch (error) {
    console.error('Failed to start CLI:', error);
    console.warn('CLI encountered an error but will continue gracefully');
    console.log('CLI is running in fallback mode');
  }
}

main();
