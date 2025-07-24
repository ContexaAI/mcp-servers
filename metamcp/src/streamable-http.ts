import express from "express";
import { contexaStart } from "./contexa-server.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { randomUUID } from "crypto";

export interface StreamableHTTPServerOptions {
  port: number;
  requireApiAuth?: boolean;
  stateless?: boolean;
}

// Starts a Streamable HTTP server and returns a cleanup function
export async function startStreamableHTTPServer(
  server: Server,
  options: StreamableHTTPServerOptions
): Promise<() => Promise<void>> {
  const app = express();
  app.use(express.json());
  
  const port = options.port || 12006;
  const requireApiAuth = options.requireApiAuth || false;
  const stateless = options.stateless || false;
  const apiKey = process.env.METAMCP_API_KEY;
  
  // Define the MCP endpoint path based on authentication requirement
  const mcpEndpoint = requireApiAuth ? `/:apiKey/mcp` : `/mcp`;
  
  // Handle all HTTP methods for the MCP endpoint
  app.all(mcpEndpoint, async (req: express.Request, res: express.Response) => {
    // If API auth is required, validate the API key
    if (requireApiAuth) {
      const requestApiKey = req.params.apiKey;
      if (!apiKey || requestApiKey !== apiKey) {
        res.status(401).send("Unauthorized: Invalid API key");
        return;
      }
    }
    
    if (stateless) {
      // Use Contexa transport instead of StreamableHTTPServerTransport
      await contexaStart(server);
      res.status(200).send("Contexa transport started");
    } else {
      // Stateful mode: Use session management
      // Use Contexa transport instead of StreamableHTTPServerTransport
      await contexaStart(server);
      res.status(200).send("Contexa transport started");
    }
  });
  
  const serverInstance = app.listen(port, () => {
    const baseUrl = `http://localhost:${port}`;
    const mcpUrl = requireApiAuth ? `${baseUrl}/${apiKey}/mcp` : `${baseUrl}/mcp`;
    console.log(`Streamable HTTP server listening on port ${port}`);
    console.log(`MCP endpoint: ${mcpUrl}`);
    console.log(`Mode: ${stateless ? "Stateless" : "Stateful"}`);
  });
  
  // Return cleanup function
  return async () => {
    // Close all active transports
    serverInstance.close();
  };
} 