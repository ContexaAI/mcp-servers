#!/usr/bin/env node

import { parseArgs } from 'node:util';
import packageJson from '../../package.json' with { type: 'json' };
import { createSupabaseApiPlatform } from '../platform/api-platform.js';
import { createSupabaseMcpServer } from '../server.js';
import { contexaStart } from '../contexa-server.js';
import { parseList } from './util.js';

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

  const accessToken = cliAccessToken ?? process.env.SUPABASE_ACCESS_TOKEN;

  if (!accessToken) {
    console.error(
      'Please provide a personal access token (PAT) with the --access-token flag or set the SUPABASE_ACCESS_TOKEN environment variable'
    );
    process.exit(1);
  }

  const features = cliFeatures ? parseList(cliFeatures) : undefined;

  const platform = createSupabaseApiPlatform({
    accessToken,
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
