import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerAllTools, registerToolsBySet } from "../tools/index.js";
import { getServerVersion } from "../utils/getServerVersion.js";
import { contexaStart } from "../contexa-server.js";
import type { ToolSet } from "../constants/index.js";

const VERSION = getServerVersion();

/**
 * ServerConfig interface for configuring the MCP server
 */
interface ServerConfig {
  port: number;
  toolSets?: ToolSet[];
  accessToken?: string;
}

/**
 * Create MCP server function used by the stateless server
 */
function createMcpServer({
  config,
  toolSets,
  accessToken: serverAccessToken,
}: {
  config?: { FMP_ACCESS_TOKEN?: string; FMP_TOOL_SETS?: string };
  toolSets?: ToolSet[];
  accessToken?: string;
}) {
  // Use server access token if provided, otherwise fall back to config
  const accessToken = serverAccessToken || config?.FMP_ACCESS_TOKEN;

  // Parse tool sets from Smithery config if provided and no tool sets were specified
  let finalToolSets = toolSets || [];
  if (config?.FMP_TOOL_SETS && finalToolSets.length === 0) {
    finalToolSets = config.FMP_TOOL_SETS.split(",").map((s) =>
      s.trim()
    ) as ToolSet[];
  }

  const mcpServer = new McpServer({
    name: "Financial Modeling Prep MCP",
    version: VERSION,
    configSchema: {
      type: "object",
      required: ["FMP_ACCESS_TOKEN"],
      properties: {
        FMP_ACCESS_TOKEN: {
          type: "string",
          title: "FMP Access Token",
          description: "Financial Modeling Prep API access token",
        },
        FMP_TOOL_SETS: {
          type: "string",
          title: "Tool Sets (Optional)",
          description:
            "Comma-separated list of tool sets to load (e.g., 'search,company,quotes'). If not specified, all tools will be loaded.",
        },
      },
    },
  });

  // Use tool sets if provided, otherwise register all tools for backward compatibility
  if (finalToolSets && finalToolSets.length > 0) {
    registerToolsBySet(mcpServer, finalToolSets, accessToken);
  } else {
    registerAllTools(mcpServer, accessToken);
  }

  return mcpServer.server;
}

/**
 * Start the server with the given configuration
 * @param config - Server configuration
 */
export async function startServer(config: ServerConfig): Promise<void> {
  const { toolSets, accessToken } = config;

  // Create the MCP server
  const mcpServer = createMcpServer({
    toolSets,
    accessToken,
  });

  // Start the server with Contexa transport
  await contexaStart(mcpServer);

  // Log startup information
  if (toolSets && toolSets.length > 0) {
    console.log(`Tool sets enabled: ${toolSets.join(", ")}`);
  } else {
    console.log("All tool sets enabled (default)");
  }
}
