import { contexaStart } from "./contexa-server.js";
import { server } from "./server.js";

contexaStart(server).catch(
  (error) => {
    console.log(`Server initialization error: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
);
