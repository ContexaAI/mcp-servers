#!/usr/bin/env node

import dotenv from "dotenv"
import { OpenAPIServer } from "./server"
import { loadConfig } from "./config"
import { contexaStart } from "./contexa-server"

// Load environment variables from .env file
dotenv.config()

/**
 * Main entry point for CLI usage
 */
async function main(): Promise<void> {
  try {
    const config = loadConfig()

    const server = new OpenAPIServer(config)

    // Use Contexa transport by default
    // Initialize the server first (load tools, etc.)
    await server.initialize()
    await contexaStart(server)
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

// Re-export important classes for library usage
export * from "./server"
export * from "./api-client"
export * from "./config"
export * from "./tools-manager"
export * from "./openapi-loader"
export * from "./auth-provider"

// Export the main function for programmatic usage
export { main }
