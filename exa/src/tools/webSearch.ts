import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import axios from "axios";
import { z } from "zod";
import { ExaSearchRequest, ExaSearchResponse } from "../types.js";
import { createRequestLogger } from "../utils/logger.js";
import { API_CONFIG } from "./config.js";

export function registerWebSearchTool(server: McpServer, config?: { exaApiKey?: string }): void {
  server.tool(
    "web_search_exa",
    "Search the web using Exa AI - performs real-time web searches and can scrape content from specific URLs. Supports configurable result counts and returns the content from the most relevant websites.",
    {
      query: z.string().describe("Search query"),
      numResults: z.number().optional().describe("Number of search results to return (default: 5)")
    },
    async ({ query, numResults }) => {
      const requestId = `web_search_exa-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const logger = createRequestLogger(requestId, 'web_search_exa');

      logger.start(query);

      try {
        // Create a fresh axios instance for each request
        const axiosInstance = axios.create({
          baseURL: API_CONFIG.BASE_URL,
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'x-api-key': config?.exaApiKey || process.env.EXA_API_KEY || ''
          },
          timeout: 25000
        });

        const searchRequest: ExaSearchRequest = {
          query,
          type: "auto",
          numResults: numResults || API_CONFIG.DEFAULT_NUM_RESULTS,
          contents: {
            text: {
              maxCharacters: API_CONFIG.DEFAULT_MAX_CHARACTERS
            },
            livecrawl: 'preferred'
          }
        };

        logger.log("Sending request to Exa API");

        const response = await axiosInstance.post<ExaSearchResponse>(
          API_CONFIG.ENDPOINTS.SEARCH,
          searchRequest,
          { timeout: 25000 }
        );

        logger.log("Received response from Exa API");

        if (!response.data || !response.data.results) {
          logger.log("Warning: Empty or invalid response from Exa API");
          return {
            content: [{
              type: "text" as const,
              text: "No search results found. Please try a different query."
            }]
          };
        }

        logger.log(`Found ${response.data.results.length} results`);

        const result = {
          content: [{
            type: "text" as const,
            text: JSON.stringify(response.data, null, 2)
          }]
        };

        logger.complete();
        return result;
      } catch (error) {
        logger.error(error);

        if (axios.isAxiosError(error)) {
          // Handle Axios errors specifically
          const statusCode = error.response?.status || 'unknown';
          const errorMessage = error.response?.data?.message || error.message;

          logger.log(`Axios error (${statusCode}): ${errorMessage}`);
          return {
            content: [{
              type: "text" as const,
              text: `Search error (${statusCode}): ${errorMessage}`
            }],
            isError: true,
          };
        }

        // Handle generic errors
        return {
          content: [{
            type: "text" as const,
            text: `Search error: ${error instanceof Error ? error.message : String(error)}`
          }],
          isError: true,
        };
      }
    }
  );
} 