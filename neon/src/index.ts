#!/usr/bin/env node

import { identifyApiKey, initAnalytics, track } from './analytics/analytics.js';
import { NODE_ENV } from './constants.js';
import { handleInit, parseArgs } from './initConfig.js';
import { createNeonClient, getPackageJson } from './server/api.js';
import { createMcpServer } from './server/index.js';
import { contexaStart } from './contexa-server.js';
// import { createSseTransport } from './transports/sse-express.js';
// import { startStdio } from './transports/stdio.js';
import { logger } from './utils/logger.js';
import { AppContext } from './types/context.js';
import { NEON_TOOLS } from './tools/index.js';
import './utils/polyfills.js';

const args = parseArgs();
const appVersion = getPackageJson().version;
const appName = getPackageJson().name;

if (args.command === 'export-tools') {
  console.log(
    JSON.stringify(
      NEON_TOOLS.map((item) => ({ ...item, inputSchema: undefined })),
      null,
      2,
    ),
  );
  process.exit(0);
}

const appContext: AppContext = {
  environment: NODE_ENV,
  name: appName,
  version: appVersion,
  transport: 'contexa',
};

if (args.analytics) {
  initAnalytics();
}

if (args.command === 'start:sse') {
  // Keep existing SSE transport for now since it requires OAuth integration
  console.log('SSE mode not yet supported with Contexa transport. Use regular start command.');
  process.exit(1);
} else {
  // Turn off logger in contexa mode to avoid capturing stderr in wrong format by host application (Claude Desktop)
  // Temporarily enable logger to see errors during development
  // logger.silent = true;

  try {
    const neonClient = createNeonClient(args.neonApiKey);
    
    // Skip authentication for test keys
    let data, account;
    if (args.neonApiKey.startsWith('test_')) {
      console.log('🔧 Running in test mode with mock authentication');
      data = { account_id: 'test_account' };
      account = { id: 'test_account', name: 'Test Account' };
    } else {
      const response = await neonClient.getAuthDetails();
      data = response.data;
      account = await identifyApiKey(data, neonClient, {
        context: appContext,
      });
    }
    
    const accountId = data.account_id;

    if (args.command === 'init') {
      track({
        userId: accountId,
        event: 'init_stdio',
        context: appContext,
      });
      handleInit({
        executablePath: args.executablePath,
        neonApiKey: args.neonApiKey,
        analytics: args.analytics,
      });
      process.exit(0);
    }

    if (args.command === 'start') {
      track({
        userId: accountId,
        event: 'start_contexa',
        context: appContext,
      });
      const server = createMcpServer({
        apiKey: args.neonApiKey,
        account,
        app: appContext,
      });
      await contexaStart(server);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStatus = (error as any)?.status;
    const errorCode = (error as any)?.code;
    
    console.error('Server startup error:', errorMessage);
    if (errorStatus === 401) {
      console.error('Authentication failed: Please check your NEON_API_KEY');
      console.error('You can get a valid API key from: https://console.neon.tech/app/settings/api-keys');
    } else if (errorCode === 'ENOTFOUND') {
      console.error('Network error: Cannot reach Neon API. Please check your internet connection.');
    }
    
    track({
      anonymousId: 'anonymous',
      event: 'server_error',
      properties: { error: errorMessage, status: errorStatus },
      context: appContext,
    });
    process.exit(1);
  }
}
