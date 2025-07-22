import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as Charts from "./charts";
import { contexaStart } from "./contexa-server";
import { callTool } from "./utils/callTool";
import { getDisabledTools } from "./utils/env";

/**
 * Creates and configures an MCP server for chart generation.
 */
export function createServer(): Server {
  const server = new Server(
    {
      name: "mcp-server-chart",
      version: "0.7.1",
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  setupToolHandlers(server);

  server.onerror = (error) => console.error("[MCP Error]", error);
  process.on("SIGINT", async () => {
    await server.close();
    process.exit(0);
  });

  return server;
}

/**
 * Gets enabled tools based on environment variables.
 */
function getEnabledTools() {
  const disabledTools = getDisabledTools();
  const allCharts = Object.values(Charts);

  if (disabledTools.length === 0) {
    return allCharts;
  }

  return allCharts.filter((chart) => !disabledTools.includes(chart.tool.name));
}

/**
 * Sets up tool handlers for the MCP server.
 */
function setupToolHandlers(server: Server): void {
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: getEnabledTools().map((chart) => chart.tool),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    return await callTool(request.params.name, request.params.arguments);
  });
}

/**
 * Runs the server with Contexa transport.
 */
export async function runContexaServer(): Promise<void> {
  const server = createServer();
  await contexaStart(server);
}
