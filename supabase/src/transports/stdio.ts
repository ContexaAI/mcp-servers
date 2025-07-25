#!/usr/bin/env node

import { parseArgs } from 'node:util';
import packageJson from '../../package.json' with { type: 'json' };
import { createSupabaseApiPlatform } from '../platform/api-platform.js';
import { createSupabaseMcpServer } from '../server.js';
import { contexaStart } from '../contexa-server.js';
import { parseList } from './util.js';
import { getEnvVar } from '../config/env-loader.js';

const { version } = packageJson;

async function main() {
  const {
    values: {
      ['access-token']: cliAccessToken,
      ['project-ref']: projectId,
      ['read-only']: readOnly,
      ['api-url']: apiUrl,
      ['version']: showVersion,
      ['features']: cliFeatures,
    },
  } = parseArgs({
    options: {
      ['access-token']: {
        type: 'string',
      },
      ['project-ref']: {
        type: 'string',
      },
      ['read-only']: {
        type: 'boolean',
        default: false,
      },
      ['api-url']: {
        type: 'string',
      },
      ['version']: {
        type: 'boolean',
      },
      ['features']: {
        type: 'string',
      },
    },
  });

  if (showVersion) {
    console.log(version);
    process.exit(0);
  }

  // Load environment variables with warnings but don't exit if missing
  const accessToken = cliAccessToken ?? getEnvVar('SUPABASE_ACCESS_TOKEN', false);
  
  if (!accessToken) {
    console.warn('⚠️  Warning: SUPABASE_ACCESS_TOKEN is not set');
    console.warn('   The server will start but may not function properly without authentication');
    console.warn('   You can set it via --access-token flag or SUPABASE_ACCESS_TOKEN environment variable');
  }

  const features = cliFeatures ? parseList(cliFeatures) : undefined;

  const platform = createSupabaseApiPlatform({
    accessToken: accessToken || '', // Provide empty string as fallback
    apiUrl,
  });

  const server = createSupabaseMcpServer({
    platform,
    projectId,
    readOnly,
    features,
  });

  try {
    await contexaStart(server);
  } catch (error) {
    console.error('Failed to start Contexa server:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

main().catch(console.error);
