#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Import tool implementations
import { contexaStart } from "./contexa-server.js";
import { registerCompanyResearchTool } from "./tools/companyResearch.js";
import { registerCompetitorFinderTool } from "./tools/competitorFinder.js";
import { registerCrawlingTool } from "./tools/crawling.js";
import { registerGithubSearchTool } from "./tools/githubSearch.js";
import { registerLinkedInSearchTool } from "./tools/linkedInSearch.js";
import { registerResearchPaperSearchTool } from "./tools/researchPaperSearch.js";
import { registerWebSearchTool } from "./tools/webSearch.js";
import { registerWikipediaSearchTool } from "./tools/wikipediaSearch.js";
import { log } from "./utils/logger.js";

// Configuration schema for the EXA API key and tool selection
export const configSchema = z.object({
  exaApiKey: z.string().optional().describe("Exa AI API key for search operations"),
  enabledTools: z.array(z.string()).optional().describe("List of tools to enable (if not specified, all tools are enabled)"),
  debug: z.boolean().default(false).describe("Enable debug logging")
});


/**
 * Exa AI Web Search MCP Server
 * 
 * This MCP server integrates Exa AI's search capabilities with Claude and other MCP-compatible clients.
 * Exa is a search engine and API specifically designed for up-to-date web searching and retrieval,
 * offering more recent and comprehensive results than what might be available in an LLM's training data.
 * 
 * The server provides tools that enable:
 * - Real-time web searching with configurable parameters
 * - Research paper searches
 * - Company research and analysis
 * - Competitive intelligence
 * - And more!
 */


// Create MCP server
const server = new McpServer({
  name: "exa-search-server",
  version: "1.0.0"
});

log("Server initialized with modern MCP SDK and Smithery CLI support");

const config = {
  exaApiKey: process.env.EXA_API_KEY,
  enabledTools: ['web_search_exa', 'research_paper_search_exa', 'company_research_exa', 'crawling_exa', 'competitor_finder_exa', 'linkedin_search_exa', 'wikipedia_search_exa', 'github_search_exa'],
  debug: true
};

// Register tools based on configuration
const registeredTools: string[] = [];

registerWebSearchTool(server, config);
registeredTools.push('web_search_exa');


registerResearchPaperSearchTool(server, config);
registeredTools.push('research_paper_search_exa');

registerCompanyResearchTool(server, config);
registeredTools.push('company_research_exa');

registerCrawlingTool(server, config);
registeredTools.push('crawling_exa');

registerCompetitorFinderTool(server, config);
registeredTools.push('competitor_finder_exa');

registerLinkedInSearchTool(server, config);
registeredTools.push('linkedin_search_exa');

registerWikipediaSearchTool(server, config);
registeredTools.push('wikipedia_search_exa');

registerGithubSearchTool(server, config);
registeredTools.push('github_search_exa');

contexaStart(server).catch((error) => {
  log(`Server initialization error: ${error instanceof Error ? error.message : String(error)}`);
  throw error;
});
