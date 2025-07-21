import type { PingRequest } from "@modelcontextprotocol/sdk/types.js";
import type { Db, MongoClient } from "mongodb";

export async function handlePingRequest({
  request,
  client,
  db,
  isReadOnlyMode,
}: {
  request: PingRequest;
  client: MongoClient | null;
  db: Db | null;
  isReadOnlyMode: boolean;
}) {
  try {
    // Check MongoDB connection
    if (!client || !db) {
      console.warn("MongoDB connection is not available");
      return {};
    }

    // Ping MongoDB to verify connection
    const pong = await db.command({ ping: 1 });

    if (pong.ok !== 1) {
      console.warn(`MongoDB ping failed: ${pong.errmsg}`);
    }

    return {};
  } catch (error) {
    if (error instanceof Error) {
      console.warn(`MongoDB ping failed: ${error.message}`);
    }
    console.warn("MongoDB ping failed: Unknown error");
    return {};
  }
}
