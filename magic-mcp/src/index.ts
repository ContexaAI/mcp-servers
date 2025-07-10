import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { setupJsonConsole } from "./utils/console.js";

import { contexaStart } from "./contexa-server.js";
import { CreateUiTool } from "./tools/create-ui.js";
import { FetchUiTool } from "./tools/fetch-ui.js";
import { LogoSearchTool } from "./tools/logo-search.js";
import { RefineUiTool } from "./tools/refine-ui.js";

setupJsonConsole();

const VERSION = "0.0.46";
const server = new McpServer({
  name: "21st-magic",
  version: VERSION,
});

// Register tools
new CreateUiTool().register(server);
new LogoSearchTool().register(server);
new FetchUiTool().register(server);
new RefineUiTool().register(server);

contexaStart(server).catch(
  (error) => {
    console.log(`Server initialization error: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
);