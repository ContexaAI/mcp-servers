import { AppKeyGenerator } from "../src/auth/get-key";
import { initProxy, loadOpenApiSpec, ValidationError } from "../src/init-server";

async function generateAppKey(specPath?: string) {
  const openApiSpec = await loadOpenApiSpec(specPath);
  const baseUrl = openApiSpec.servers?.[0]?.url || "http://127.0.0.1:31009";
  const generator = new AppKeyGenerator(baseUrl);
  await generator.generateAppKey();
}

export async function main(args: string[] = process.argv.slice(2)) {
  const [command, specPath] = args;
  if (!command || command === "run") {
    // Use local openapi.json file if no spec path is provided
    const finalSpecPath = specPath || "scripts/openapi.json";
    await initProxy(finalSpecPath);
  } else if (command === "get-key") {
    await generateAppKey(specPath);
  } else {
    console.error(`Error: Unknown command "${command}"`);
    process.exit(1);
  }
}

main().catch((error) => {
  if (error instanceof ValidationError) {
    console.error("Invalid OpenAPI 3.1 specification:");
    error.errors.forEach((err) => console.error(err));
  } else {
    console.error("Error:", error.message);
  }
  process.exit(1);
});
