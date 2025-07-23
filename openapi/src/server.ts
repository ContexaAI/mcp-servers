import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { Transport } from "@modelcontextprotocol/sdk/shared/transport.js"
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js"
import { OpenAPIMCPServerConfig } from "./config"
import { ToolsManager } from "./tools-manager"
import { ApiClient } from "./api-client"
import { Tool } from "@modelcontextprotocol/sdk/types.js"
import { StaticAuthProvider } from "./auth-provider.js"

/**
 * MCP server implementation for OpenAPI specifications
 */
export class OpenAPIServer {
  private server: Server
  private toolsManager: ToolsManager
  private apiClient: ApiClient | null

  constructor(config: OpenAPIMCPServerConfig) {
    this.server = new Server(
      { name: config.name, version: config.version },
      {
        capabilities: {
          tools: {
            list: true,
            execute: true,
          },
        },
      },
    )
    this.toolsManager = new ToolsManager(config)

    // Use AuthProvider if provided, otherwise fallback to static headers
    const authProviderOrHeaders = config.authProvider || new StaticAuthProvider(config.headers)
    
    // Create API client only if apiBaseUrl is provided
    if (config.apiBaseUrl) {
      this.apiClient = new ApiClient(
        config.apiBaseUrl,
        authProviderOrHeaders,
        this.toolsManager.getSpecLoader(),
      )
    } else {
      console.warn("⚠️  No API base URL provided. API client not initialized.")
      this.apiClient = null
    }

    this.initializeHandlers()
  }

  /**
   * Initialize request handlers
   */
  private initializeHandlers(): void {
    // Handle tool listing
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: this.toolsManager.getAllTools() as any,
      }
    })

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { id, name, arguments: params } = request.params

      console.error("Received request:", request.params)
      console.error("Using parameters from arguments:", params)

      // Find tool by ID or name
      const idOrName = typeof id === "string" ? id : typeof name === "string" ? name : ""
      if (!idOrName) {
        throw new Error("Tool ID or name is required")
      }

      const toolInfo = this.toolsManager.findTool(idOrName)
      if (!toolInfo) {
        console.error(
          `Available tools: ${Array.from(this.toolsManager.getAllTools())
            .map((t) => t.name)
            .join(", ")}`,
        )
        throw new Error(`Tool not found: ${idOrName}`)
      }

      const { toolId, tool } = toolInfo
      console.error(`Executing tool: ${toolId} (${tool.name})`)

      try {
        // Check if API client is available
        if (!this.apiClient) {
          return {
            content: [
              {
                type: "text",
                text: "Error: API client not initialized. Please provide API_BASE_URL in your configuration.",
              },
            ],
            isError: true,
          }
        }

        // Execute the API call
        const result = await this.apiClient.executeApiCall(toolId, params || {})

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        }
      } catch (error) {
        if (error instanceof Error) {
          return {
            content: [
              {
                type: "text",
                text: `Error: ${error.message}`,
              },
            ],
            isError: true,
          }
        }
        throw error
      }
    })
  }

  /**
   * Initialize the server (load tools, etc.) without connecting to a transport
   */
  async initialize(): Promise<void> {
    await this.toolsManager.initialize()

    // Pass the tools to the API client if available
    if (this.apiClient) {
      const toolsMap = new Map<string, Tool>()
      for (const [toolId, tool] of this.toolsManager.getToolsWithIds()) {
        toolsMap.set(toolId, tool)
      }
      this.apiClient.setTools(toolsMap)

      // Pass the OpenAPI spec to the API client for dynamic meta-tools
      const spec = this.toolsManager.getOpenApiSpec()
      if (spec) {
        this.apiClient.setOpenApiSpec(spec)
      }
    } else {
      console.warn("⚠️  API client not available. Tools and spec not configured.")
    }
  }

  /**
   * Get the underlying MCP server instance
   */
  getServer(): Server {
    return this.server
  }

  /**
   * Start the server with the given transport
   */
  async start(transport: Transport): Promise<void> {
    await this.initialize()
    await this.server.connect(transport)
  }
}
