#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { logWithTimestamp } from "./utils.js";
import { contexaStart } from "./contexa-server.js";
import setupServer from "./transports/setup_server.js";
import { NAME, VERSION } from "./common.js";
import { env } from "./env.js";

// Start the server
async function main() {
  try {
    const envVars = env.getAll();
    logWithTimestamp({
      data: `Loaded environment variables: ${Object.keys(envVars).join(', ')}`
    });
  } catch (error) {
    logWithTimestamp({
      level: "error",
      data: ["Failed to load environment variables:", error]
    });
  }

  // Create MCP server instance
  const server = new McpServer(
    {
      name: NAME,
      version: VERSION,
    },
    {
      capabilities: {
        resources: {},
      },
    }
  );

  // Setup server with tools and resources
  setupServer(server);

  // Start Contexa transport
  await contexaStart(server).catch(
    (error) => {
      console.log(`Server initialization error: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  );
}

main().catch((error) => {
  logWithTimestamp({
    level: "error",
    data: ["Fatal error in main():", error],
  });
  process.exit(1);
});
