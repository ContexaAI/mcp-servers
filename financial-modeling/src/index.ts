#!/usr/bin/env node

import minimist from "minimist";
import { startServer } from "./server/server.js";
import { type ToolSet, getAvailableToolSets } from "./constants/index.js";

// Main function
async function main() {
  // Parse command line arguments
  const argv = minimist(process.argv.slice(2));

// Show help if requested
if (argv.help || argv.h) {
  showHelp();
  process.exit(0);
}

// Get configuration from environment variables and command line
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const fmpToken = argv["fmp-token"] || process.env.FMP_ACCESS_TOKEN;

// Parse toolSets argument from command line or environment variable
let toolSets: ToolSet[] = [];
const toolSetsInput =
  argv["tool-sets"] || argv["toolSets"] || process.env.FMP_TOOL_SETS;
if (toolSetsInput && typeof toolSetsInput === "string") {
  toolSets = toolSetsInput.split(",").map((s) => s.trim()) as ToolSet[];
}

// Validate tool sets
const availableToolSets = getAvailableToolSets().map(({ key }) => key);
const invalidToolSets = toolSets.filter(
  (ts) => !availableToolSets.includes(ts)
);
if (invalidToolSets.length > 0) {
  console.error(`Invalid tool sets: ${invalidToolSets.join(", ")}`);
  console.error(`Available tool sets: ${availableToolSets.join(", ")}`);
  process.exit(1);
}

await startServer({ port, toolSets });

// Log startup information
if (fmpToken) {
  console.log(
    "Financial Modeling Prep MCP server initialized successfully with API token"
  );
} else {
  console.log("Financial Modeling Prep MCP server initialized successfully");
  console.log("Note: API token can be provided via:");
  console.log("  - Environment variable: FMP_ACCESS_TOKEN");
  console.log("  - Command line argument: --fmp-token");
  console.log("  - Smithery configuration when using with Smithery");
}
}

// Call main function
main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

function showHelp() {
  console.log(`
Financial Modeling Prep MCP Server

Usage: npm start [options]

Options:
  --port <number>              Server port (default: 3000)
  --fmp-token <token>          FMP API access token
  --tool-sets <sets>           Comma-separated list of tool sets to load
  --help, -h                   Show this help message

Available Tool Sets:
`);

  const toolSets = getAvailableToolSets();
  toolSets.forEach(({ key, definition }) => {
    console.log(`  ${key.padEnd(20)} ${definition.name}`);
    console.log(`  ${" ".repeat(20)} ${definition.description}`);
    console.log();
  });

  console.log(`
Examples:
  npm start                                    # Load all tools (253 tools)
  npm start -- --tool-sets search,company     # Load only search and company tools
  npm start -- --tool-sets quotes,charts      # Load only quotes and charts tools
  npm start -- --port 4000 --tool-sets crypto,forex  # Custom port with crypto and forex tools

Environment Variables:
  PORT              Server port
  FMP_ACCESS_TOKEN  Financial Modeling Prep API access token
  FMP_TOOL_SETS     Comma-separated list of tool sets to load
`);
}
