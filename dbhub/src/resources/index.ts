import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { tablesResourceHandler } from "./tables.js";
import { tableStructureResourceHandler } from "./schema.js";
import { schemasResourceHandler } from "./schemas.js";
import { indexesResourceHandler } from "./indexes.js";
import { proceduresResourceHandler, procedureDetailResourceHandler } from "./procedures.js";

// Export all resource handlers
export { tablesResourceHandler } from "./tables.js";
export { tableStructureResourceHandler } from "./schema.js";
export { schemasResourceHandler } from "./schemas.js";
export { indexesResourceHandler } from "./indexes.js";
export { proceduresResourceHandler, procedureDetailResourceHandler } from "./procedures.js";

/**
 * Register all resource handlers with the MCP server
 */
export function registerResources(server: McpServer): void {
  // Resource for listing all schemas
  server.resource("schemas", "db://schemas", schemasResourceHandler);

  // Allow listing tables within a specific schema
  server.resource(
    "tables_in_schema",
    new ResourceTemplate("db://schemas/{schemaName}/tables", { list: undefined }),
    tablesResourceHandler
  );

  // Resource for getting table structure within a specific database schema
  server.resource(
    "table_structure_in_schema",
    new ResourceTemplate("db://schemas/{schemaName}/tables/{tableName}", { list: undefined }),
    tableStructureResourceHandler
  );

  // Resource for getting indexes for a table within a specific database schema
  server.resource(
    "indexes_in_table",
    new ResourceTemplate("db://schemas/{schemaName}/tables/{tableName}/indexes", {
      list: undefined,
    }),
    indexesResourceHandler
  );

  // Resource for listing stored procedures within a schema
  server.resource(
    "procedures_in_schema",
    new ResourceTemplate("db://schemas/{schemaName}/procedures", { list: undefined }),
    proceduresResourceHandler
  );

  // Resource for getting procedure detail within a schema
  server.resource(
    "procedure_detail_in_schema",
    new ResourceTemplate("db://schemas/{schemaName}/procedures/{procedureName}", {
      list: undefined,
    }),
    procedureDetailResourceHandler
  );
}
