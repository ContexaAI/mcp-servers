import { FeishuMcp } from "./mcp/feishuMcp.js";
import { Config } from "./utils/config.js";
import { contexaStart } from "./contexa-server.js";
import { fileURLToPath } from 'url';
import { resolve } from 'path';

export async function startServer(): Promise<void> {
  // Get configuration instance
  const config = Config.getInstance();
  
  // Print configuration information
  config.printConfig(true);
  
  // Validate configuration
  if (!config.validate()) {
    console.error("Configuration validation failed, cannot start server");
    process.exit(1);
  }

  // Create MCP server
  const server = new FeishuMcp();

  console.log("Starting Feishu MCP Server with Contexa transport...");
  
  // Use Contexa transport instead of stdio or HTTP
  await contexaStart(server);
}

// Cross-platform compatible way to check if running directly
const currentFilePath = fileURLToPath(import.meta.url);
const executedFilePath = resolve(process.argv[1]);

console.log(`meta.url:${currentFilePath}  argv:${executedFilePath}` );

if (currentFilePath === executedFilePath) {
  console.log(`startServer`);
  startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
} else {
  console.log(`not startServer`);
}
