import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { loadJsonEnv } from './utils/env-loader.js';

// Load environment variables from JSON format first, then fallback to standard .env
loadJsonEnv();
config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'),
);
// Determine Claude config path based on OS platform
let claudeConfigPath: string;
const platform = os.platform();

if (platform === 'win32') {
  // Windows path - using %APPDATA%
  // For Node.js, we access %APPDATA% via process.env.APPDATA
  claudeConfigPath = path.join(
    process.env.APPDATA || '',
    'Claude',
    'claude_desktop_config.json',
  );
} else {
  // macOS and Linux path (according to official docs)
  claudeConfigPath = path.join(
    os.homedir(),
    'Library',
    'Application Support',
    'Claude',
    'claude_desktop_config.json',
  );
}

const MCP_NEON_SERVER = 'neon';

type Args =
  | {
      command: 'start:sse';
      analytics: boolean;
    }
  | {
      command: 'start';
      neonApiKey: string | undefined;
      analytics: boolean;
    }
  | {
      command: 'init';
      executablePath: string;
      neonApiKey: string | undefined;
      analytics: boolean;
    }
  | {
      command: 'export-tools';
    };

const commands = ['init', 'start', 'start:sse', 'export-tools'] as const;

export const parseArgs = (): Args => {
  const args = process.argv;
  const [, scriptPath, commandArg, apiKeyArg, analyticsArg] = args;

  if (args.length < 3) {
    console.warn('Warning: Invalid number of arguments, using default start command');
    return {
      command: 'start',
      neonApiKey: process.env.FB_ACCESS_TOKEN,
      analytics: true,
    };
  }

  if (args.length === 3 && commandArg === 'start:sse') {
    return {
      command: 'start:sse',
      analytics: true,
    };
  }

  if (args.length === 3 && commandArg === 'export-tools') {
    return {
      command: 'export-tools',
    };
  }

  const command = commandArg;

  if (!commands.includes(command as (typeof commands)[number])) {
    console.warn(`Warning: Invalid command: ${command}, using default start command`);
    return {
      command: 'start',
      neonApiKey: process.env.FB_ACCESS_TOKEN,
      analytics: true,
    };
  }

  if (command === 'export-tools') {
    return {
      command: 'export-tools',
    };
  }

  // Get API key from command line args or environment variable
  const neonApiKey = apiKeyArg || process.env.FB_ACCESS_TOKEN;
  
  if (!neonApiKey) {
    console.warn(
      'Warning: No FB_ACCESS_TOKEN provided. Server will run in test mode with limited functionality.',
    );
  }

  return {
    executablePath: scriptPath,
    command: command as 'start' | 'init',
    neonApiKey: neonApiKey,
    analytics: !analyticsArg?.includes('no-analytics'),
  };
};

export function handleInit({
  executablePath,
  neonApiKey,
  analytics,
}: {
  executablePath: string;
  neonApiKey: string | undefined;
  analytics: boolean;
}) {
  // If the executable path is a local path to the dist/index.js file, use it directly
  // Otherwise, use the name of the package to always load the latest version from remote
  const serverPath = executablePath.includes('dist/index.js')
    ? executablePath
    : packageJson.name;

  const neonConfig = {
    command: 'npx',
    args: [
      '-y',
      serverPath,
      'start',
      neonApiKey || '',
      analytics ? '' : '--no-analytics',
    ],
  };

  const configDir = path.dirname(claudeConfigPath);
  if (!fs.existsSync(configDir)) {
    console.log(chalk.blue('Creating Claude config directory...'));
    fs.mkdirSync(configDir, { recursive: true });
  }

  const existingConfig = fs.existsSync(claudeConfigPath)
    ? JSON.parse(fs.readFileSync(claudeConfigPath, 'utf8'))
    : { mcpServers: {} };

  if (MCP_NEON_SERVER in (existingConfig?.mcpServers || {})) {
    console.log(chalk.yellow('Replacing existing Neon MCP config...'));
  }

  const newConfig = {
    ...existingConfig,
    mcpServers: {
      ...existingConfig.mcpServers,
      [MCP_NEON_SERVER]: neonConfig,
    },
  };

  fs.writeFileSync(claudeConfigPath, JSON.stringify(newConfig, null, 2));
  console.log(chalk.green(`Config written to: ${claudeConfigPath}`));
  console.log(
    chalk.blue(
      'The Neon MCP server will start automatically the next time you open Claude.',
    ),
  );
}
