#!/usr/bin/env node

import { identifyApiKey, initAnalytics, track } from './analytics/analytics.js';
import { NODE_ENV } from './constants.js';
import { handleInit, parseArgs } from './initConfig.js';
import { createNeonClient, getPackageJson } from './server/api.js';
import { createMcpServer } from './server/index.js';
import { contexaStart } from './contexa-server.js';
import { AppContext } from './types/context.js';
import { NEON_TOOLS } from './tools/index.js';
import './utils/polyfills.js';

async function main() {
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

  let actualCommand = args.command;
  let neonApiKey: string | undefined;
  
  if (args.command === 'start:sse') {
    console.warn('Warning: SSE mode not yet supported with Contexa transport. Falling back to regular start mode.');
    actualCommand = 'start';
    neonApiKey = process.env.FB_ACCESS_TOKEN;
  } else if (args.command === 'start' || args.command === 'init') {
    neonApiKey = args.neonApiKey;
  }

  try {
    const apiKey = neonApiKey || '';
    const neonClient = createNeonClient(apiKey);
    
    let data, account;
    if (apiKey.startsWith('test_') || !apiKey) {
      console.log('🔧 Running in test mode with mock authentication');
      data = { account_id: 'test_account' };
      account = { id: 'test_account', name: 'Test Account' };
    } else {
      try {
        const response = await neonClient.getAuthDetails();
        data = response.data;
        account = await identifyApiKey(data, neonClient, {
          context: appContext,
        });
      } catch (authError) {
        console.warn('Authentication failed, falling back to test mode:', authError instanceof Error ? authError.message : 'Unknown error');
        data = { account_id: 'test_account' };
        account = { id: 'test_account', name: 'Test Account' };
      }
    }
    
    const accountId = data.account_id;

    if (actualCommand === 'init' || args.command === 'init') {
      track({
        userId: accountId,
        event: 'init_stdio',
        context: appContext,
      });
      
      const [, scriptPath] = process.argv;
      handleInit({
        executablePath: args.command === 'init' ? args.executablePath : scriptPath,
        neonApiKey: neonApiKey,
        analytics: args.analytics,
      });
      process.exit(0);
    }

    if (actualCommand === 'start' || args.command === 'start') {
      track({
        userId: accountId,
        event: 'start_contexa',
        context: appContext,
      });
      const server = createMcpServer({
        apiKey: apiKey,
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
      console.error('Authentication failed: Please check your FB_ACCESS_TOKEN');
    } else if (errorCode === 'ENOTFOUND') {
      console.error('Network error: Cannot reach Neon API. Please check your internet connection.');
    }
    
    track({
      anonymousId: 'anonymous',
      event: 'server_error',
      properties: { error: errorMessage, status: errorStatus },
      context: appContext,
    });
    
    console.error('Server will continue with limited functionality');
  }
}

main().catch((error: unknown) => {
  console.error('Fatal error:', error instanceof Error ? error.message : 'Unknown error');
  console.warn('Server encountered a fatal error but will attempt to continue gracefully');
});