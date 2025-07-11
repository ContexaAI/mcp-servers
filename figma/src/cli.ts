#!/usr/bin/env node

import { config } from "dotenv";
import { resolve } from "path";
import { getServerConfig } from "./config.js";
import { contexaStart } from "./contexa-server.js";
import { createServer } from "./mcp.js";

// Load .env from the current working directory
config({ path: resolve(process.cwd(), ".env") });

export async function startServer(): Promise<void> {
  const config = getServerConfig(false);

  const server = createServer(config.auth, { isHTTP: true });

  contexaStart(server);
}

// If we're being executed directly (not imported), start the server
if (process.argv[1]) {
  startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
}
