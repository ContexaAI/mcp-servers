import { contexaStart } from "./contexa-server.js";
import { server } from "./server.js";

async function main() {
  await contexaStart(server);
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
