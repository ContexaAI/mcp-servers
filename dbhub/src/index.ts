#!/usr/bin/env node

// Import connector modules to register them
import "./connectors/postgres/index.js"; // Register PostgreSQL connector
import "./connectors/sqlserver/index.js"; // Register SQL Server connector
import "./connectors/sqlite/index.js"; // SQLite connector
import "./connectors/mysql/index.js"; // MySQL connector
import "./connectors/mariadb/index.js"; // MariaDB connector

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerResources } from "./resources/index.js";
import { registerTools } from "./tools/index.js";
import { registerPrompts } from "./prompts/index.js";
import { ConnectorManager } from "./connectors/manager.js";
import { getSqliteInMemorySetupSql } from "./config/demo-loader.js";
import { resolveDSN, redactDSN, isReadOnlyMode } from "./config/env.js";
import { SERVER_NAME, SERVER_VERSION, generateBanner } from "./server.js";
import { contexaStart } from "./contexa-server.js";

(async () => {
  try {
    // Register connectors
    // (already imported at top)

    // Resolve DSN
    const dsnData = resolveDSN();
    if (!dsnData) {
      console.warn("ERROR: Database connection string (DSN) is required.");
      // Do not exit; continue execution
    }

    // Create MCP server
    const server = new McpServer({
      name: SERVER_NAME,
      version: SERVER_VERSION,
    });
    registerResources(server);
    registerTools(server);
    registerPrompts(server);

    // Connect to database if DSN is available
    if (dsnData) {
      const connectorManager = new ConnectorManager();
      console.error(`Connecting with DSN: ${redactDSN(dsnData.dsn)}`);
      console.error(`DSN source: ${dsnData.source}`);
      if (dsnData.isDemo) {
        const initScript = getSqliteInMemorySetupSql();
        await connectorManager.connectWithDSN(dsnData.dsn, initScript);
      } else {
        await connectorManager.connectWithDSN(dsnData.dsn);
      }

      // Print banner
      const readonly = isReadOnlyMode();
      const activeModes = [];
      const modeDescriptions = [];
      if (dsnData.isDemo) {
        activeModes.push("DEMO");
        modeDescriptions.push("using sample employee database");
      }
      if (readonly) {
        activeModes.push("READ-ONLY");
        modeDescriptions.push("only read only queries allowed");
      }
      if (activeModes.length > 0) {
        console.error(`Running in ${activeModes.join(' and ')} mode - ${modeDescriptions.join(', ')}`);
      }
      console.error(generateBanner(SERVER_VERSION, activeModes));
    } else {
      console.error("No DSN provided. Skipping database connection and banner.");
    }

    // Start Contexa transport
    await contexaStart(server);
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
})();
