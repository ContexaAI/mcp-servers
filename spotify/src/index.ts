import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { albumTools } from './albums.js';
import { playTools } from './play.js';
import { readTools } from './read.js';
import { contexaStart } from './contexa-server.js';

const server = new McpServer({
  name: 'spotify-controller',
  version: '1.0.0',
});

[...readTools, ...playTools, ...albumTools].forEach((tool) => {
  server.tool(tool.name, tool.description, tool.schema, tool.handler);
});

async function main() {
  await contexaStart(server);
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
