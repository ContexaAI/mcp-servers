import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ListResourcesRequestSchema, ReadResourceRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { BraveSearch } from 'brave-search';
import { BraveImageSearchTool } from './tools/BraveImageSearchTool.js';
import { BraveLocalSearchTool } from './tools/BraveLocalSearchTool.js';
import { BraveNewsSearchTool } from './tools/BraveNewsSearchTool.js';
import { BraveVideoSearchTool } from './tools/BraveVideoSearchTool.js';
import { BraveWebSearchTool } from './tools/BraveWebSearchTool.js';
import { contexaStart } from './contexa-server.js';

export class BraveMcpServer {
  private server: McpServer;
  private braveSearch: BraveSearch;
  private imageSearchTool: BraveImageSearchTool;
  private webSearchTool: BraveWebSearchTool;
  private localSearchTool: BraveLocalSearchTool;
  private newsSearchTool: BraveNewsSearchTool;
  private videoSearchTool: BraveVideoSearchTool;

  constructor(private braveSearchApiKey: string) {
    this.server = new McpServer(
      {
        name: 'Brave Search MCP Server',
        description: 'A server that provides tools for searching the web, images, videos, and local businesses using the Brave Search API.',
        version: '0.6.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
          logging: {},
        },
      },
    );
    // Initialize BraveSearch with API key (can be empty string)
    this.braveSearch = new BraveSearch(braveSearchApiKey || '');
    this.imageSearchTool = new BraveImageSearchTool(this, this.braveSearch);
    this.webSearchTool = new BraveWebSearchTool(this, this.braveSearch);
    this.localSearchTool = new BraveLocalSearchTool(this, this.braveSearch, this.webSearchTool, braveSearchApiKey || '');
    this.newsSearchTool = new BraveNewsSearchTool(this, this.braveSearch);
    this.videoSearchTool = new BraveVideoSearchTool(this, this.braveSearch, braveSearchApiKey || '');
    this.setupTools();
    this.setupResourceListener();
  }

  private setupTools(): void {
    this.server.tool(
      this.imageSearchTool.name,
      this.imageSearchTool.description,
      this.imageSearchTool.inputSchema.shape,
      this.imageSearchTool.execute.bind(this.imageSearchTool),
    );
    this.server.tool(
      this.webSearchTool.name,
      this.webSearchTool.description,
      this.webSearchTool.inputSchema.shape,
      this.webSearchTool.execute.bind(this.webSearchTool),
    );
    this.server.tool(
      this.localSearchTool.name,
      this.localSearchTool.description,
      this.localSearchTool.inputSchema.shape,
      this.localSearchTool.execute.bind(this.localSearchTool),
    );
    this.server.tool(
      this.newsSearchTool.name,
      this.newsSearchTool.description,
      this.newsSearchTool.inputSchema.shape,
      this.newsSearchTool.execute.bind(this.newsSearchTool),
    );
    this.server.tool(
      this.videoSearchTool.name,
      this.videoSearchTool.description,
      this.videoSearchTool.inputSchema.shape,
      this.videoSearchTool.execute.bind(this.videoSearchTool),
    );
  }

  private setupResourceListener(): void {
    this.server.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: [
        ...Array.from(this.imageSearchTool.imageByTitle.keys()).map(title => ({
          uri: `brave-image://${title}`,
          mimeType: 'image/png',
          name: `${title}`,
        })),
      ],
    }));

    this.server.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const uri = request.params.uri.toString();
      if (uri.startsWith('brave-image://')) {
        const title = uri.split('://')[1];
        const image = this.imageSearchTool.imageByTitle.get(title);
        if (image) {
          return {
            contents: [{
              uri,
              mimeType: 'image/png',
              blob: image,
            }],
          };
        }
      }
      return {
        content: [{ type: 'text', text: `Resource not found: ${uri}` }],
        isError: true,
      };
    });
  }

  public async start() {
    await contexaStart(this.server);
    // Use console.log instead of this.log to avoid transport issues
    console.log('Server is running with Contexa transport');
  }

  public resourceChangedNotification() {
    this.server.server.notification({
      method: 'notifications/resources/list_changed',
    });
  }

  public log(
    message: string,
    level: 'error' | 'debug' | 'info' | 'notice' | 'warning' | 'critical' | 'alert' | 'emergency' = 'info',
  ): void {
    this.server.server.sendLoggingMessage({
      level,
      message,
    });
  }
}
