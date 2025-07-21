#!/usr/bin/env node
import { createServer } from "./server.js";
import { contexaStart } from "./contexa-server.js";
import { MongoClient } from "mongodb";

let mongoClient: MongoClient | null = null;

async function main() {
  const args = process.argv.slice(2);
  let connectionUrl = "";
  let readOnlyMode = process.env.MCP_MONGODB_READONLY === "true";

  for (const arg of args) {
    if (arg === "--read-only" || arg === "-r") {
      readOnlyMode = true;
    } else if (!connectionUrl) {
      connectionUrl = arg;
    }
  }

  if (!connectionUrl) {
    connectionUrl = process.env.MCP_MONGODB_URI || "";
  }

  if (!connectionUrl) {
    console.warn(
      "No MongoDB connection URL provided. Using safe default: mongodb://localhost:27017/test."
    );
    connectionUrl = "mongodb://localhost:27017/test";
  }

  if (
    !connectionUrl.startsWith("mongodb://") &&
    !connectionUrl.startsWith("mongodb+srv://")
  ) {
    console.warn(
      "Invalid MongoDB connection URL. Using safe default: mongodb://localhost:27017/test."
    );
    connectionUrl = "mongodb://localhost:27017/test";
  }

  try {
    // Fix for TypeScript: add type for globalThis
    const globalWithConnect = globalThis as typeof globalThis & {
      connectToMongoDB?: (url: string, readOnly: boolean) => Promise<{
        client: MongoClient | null;
        db: import("mongodb").Db | null;
        isConnected: boolean;
        isReadOnlyMode: boolean;
      }>;
    };
    const { client, db, isConnected, isReadOnlyMode } = await (globalWithConnect.connectToMongoDB
      ? globalWithConnect.connectToMongoDB(connectionUrl, readOnlyMode)
      : import("./mongo.js").then(m => m.connectToMongoDB(connectionUrl, readOnlyMode))
    );

    mongoClient = client;

    if (!isConnected || !client || !db) {
      console.warn("Failed to connect to MongoDB. Running in degraded mode with no database connection.");
    }

    const server = createServer(client, db, isReadOnlyMode);
    await contexaStart(server);
    console.warn("Server started. Database connection status:", isConnected);
  } catch (error) {
    console.warn("Failed to connect to MongoDB:", error);
    mongoClient = null;
    const server = createServer(null, null, readOnlyMode);
    await contexaStart(server);
    console.warn("Server started in degraded mode (no database connection).");
  }
}

process.on("SIGINT", async () => {
  if (mongoClient) {
    await mongoClient.close();
  }
  console.warn("Received SIGINT. Cleanup complete. Server will continue running.");
});

process.on("SIGTERM", async () => {
  if (mongoClient) {
    await mongoClient.close();
  }
  console.warn("Received SIGTERM. Cleanup complete. Server will continue running.");
});

main().catch((error) => {
  console.warn("Server error:", error);
});
