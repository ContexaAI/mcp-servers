import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { contexaStart } from './contexa-server';

async function main() {
  // You can customize the server name, version, and capabilities as needed
  const server = new Server(
    { name: 'ContexaWorker', version: '1.0.0' },
    { capabilities: { tools: {} } }
  );

  await contexaStart(server);
}

main().catch((err) => {
  console.error('Failed to start Contexa MCP server:', err);
  process.exit(1);
});
