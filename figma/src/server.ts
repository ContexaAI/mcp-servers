import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import cors from "cors";
import { randomUUID } from "crypto";
import express from "express";


const SERVER_NAME = "Figma MCP Server";
const SERVER_VERSION = "1.0.0";

export async function startHttpServer(server: McpServer) {
  const app = express();
  app.use(cors());
  const transports: Record<string, SSEServerTransport> = {};
  const streamableHttpTransports: Record<string, StreamableHTTPServerTransport> = {};

  app.get('/health', (_: any, res: any) => {
    res.json({ status: 'OK', server: SERVER_NAME, version: SERVER_VERSION });
  });

  app.get('/', (_: any, res: any) => {
    res.json({ status: 'OK', server: SERVER_NAME, version: SERVER_VERSION });
  });


  app.use("/mcp", express.json());

  app.post("/mcp", async (req: any, res: any) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;

    let transport: StreamableHTTPServerTransport;
    // Initial session creation
    if (!sessionId && isInitializeRequest(req.body)) {
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: (): string => randomUUID(),
        onsessioninitialized: (sessionId): void => {
          streamableHttpTransports[sessionId] = transport;
        }
      });

      transport.onclose = (): void => {
        if (transport.sessionId) {
          delete streamableHttpTransports[transport.sessionId];
        }
      };
      await server.connect(transport);
    } else if (sessionId && streamableHttpTransports[sessionId]) {
      transport = streamableHttpTransports[sessionId];
    } else {
      return res.status(400).send('Invalid sessionId');
    }

    await transport.handleRequest(req, res, req.body);
  });

  const handleSessionRequest = async (
    req: express.Request,
    res: express.Response,
  ): Promise<void> => {
    const sessionId = req.headers["mcp-session-id"] as string;
    const transport = streamableHttpTransports[sessionId];
    if (!transport) {
      res.status(400).send("Invalid or missing session ID");
      return;
    }

    try {
      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      console.error(`Error handling message for session ${sessionId}:`, error);
      if (!res.headersSent) {
        res.status(500).send('Internal server error processing message');
      }
    }
  };

  // Handle GET requests for server-to-client notifications via SSE
  app.get("/mcp", handleSessionRequest);

  // Handle DELETE requests for session termination
  app.delete("/mcp", handleSessionRequest);



  app.get("/sse", async (req: any, res: any) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');

    const transport = new SSEServerTransport('/api/messages', res);
    const sessionId = transport.sessionId;
    console.error(`New SSE connection established: ${sessionId}`);
    transports[sessionId] = transport;

    req.on('close', () => {
      console.error(`SSE connection closed: ${sessionId}`);
      delete transports[sessionId];
    });

    await server.connect(transport)
  });

  app.post("/api/messages", async (req: any, res: any) => {
    const sessionId = req.query.sessionId;

    if (!sessionId) {
      return res.status(400).send('Missing sessionId query parameter');
    }
    const transport = transports[sessionId];
    if (!transport) {
      return res.status(404).send('No active session found with the provided sessionId');
    }

    try {
      await transport.handlePostMessage(req, res);
    }

    catch (error) {
      console.error(`Error handling message for session ${sessionId}:`, error);
      if (!res.headersSent) {
        res.status(500).send('Internal server error processing message');
      }
    }

  });

  const PORT = 8080

  app.listen(PORT, () => {
    console.error(`MCP Web Server running at http://localhost:${PORT}`);
    console.error(`- SSE Endpoint: http://localhost:${PORT}/sse`);
    console.error(`- Messages Endpoint: http://localhost:${PORT}/api/messages?sessionId=YOUR_SESSION_ID`);
    console.error(`- Health Check: http://localhost:${PORT}/health`);
  });
}
