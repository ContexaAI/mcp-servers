#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import fetch from 'node-fetch';
import { contexaStart } from './contexa-server.js';


// Interface for parsing AQL REST API response.
interface AqlResponse {
  data: object;
}



// Function to load environment variables from .env file
function loadEnvVars(): Record<string, string> {
  try {
    const envConfig: Record<string, string> = {};
    
    // Load AGENTQL_API_KEY from environment
    const apiKey = process.env.AGENTQL_API_KEY;
    if (!apiKey || apiKey === 'your_api_key_here') {
      console.warn('⚠️  Warning: AGENTQL_API_KEY environment variable is not set');
      console.warn('📝 To use AgentQL features, set your API key in the .env file:');
      console.warn('   AGENTQL_API_KEY=your_actual_api_key_here');
      console.warn('🔗 Get your API key from: https://agentql.com/');
      console.warn('🚀 Server will start without AgentQL functionality');
      envConfig.AGENTQL_API_KEY = '';
    } else {
      envConfig.AGENTQL_API_KEY = apiKey;
    }
    
    return envConfig;
  } catch (error) {
    console.error('Error loading environment variables:', error);
    process.exit(1);
  }
}

// Create an MCP server with only tools capability (trigger 'query-data' call).
const server = new Server(
  {
    name: 'agentql-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

const EXTRACT_TOOL_NAME = 'extract-web-data';

// Load environment variables from .env file
const envVars = loadEnvVars();
const AGENTQL_API_KEY = envVars.AGENTQL_API_KEY;

// Handler that lists available tools.
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: EXTRACT_TOOL_NAME,
        description:
          'Extracts structured data as JSON from a web page given a URL using a Natural Language description of the data.',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'The URL of the public webpage to extract data from',
            },
            prompt: {
              type: 'string',
              description: 'Natural Language description of the data to extract from the page',
            },
          },
          required: ['url', 'prompt'],
        },
      },
    ],
  };
});

// Handler for the 'extract-web-data' tool.
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case EXTRACT_TOOL_NAME: {
      const url = String(request.params.arguments?.url);
      const prompt = String(request.params.arguments?.prompt);
      if (!url || !prompt) {
        throw new Error("Both 'url' and 'prompt' are required");
      }

      if (!AGENTQL_API_KEY) {
        throw new Error('AgentQL API key is not configured. Please set AGENTQL_API_KEY environment variable to use this tool.');
      }

      const endpoint = 'https://api.agentql.com/v1/query-data';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'X-API-Key': `${AGENTQL_API_KEY}`,
          'X-TF-Request-Origin': 'mcp-server',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
          prompt: prompt,
          params: {
            wait_for: 0,
            is_scroll_to_bottom_enabled: false,
            mode: 'fast',
            is_screenshot_enabled: false,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`AgentQL API error: ${response.statusText}\n${await response.text()}`);
      }

      const json = (await response.json()) as AqlResponse;

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(json.data, null, 2),
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown tool: '${request.params.name}'`);
  }
});

// Start the server using Contexa transport.
async function main() {
  await contexaStart(server);
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
