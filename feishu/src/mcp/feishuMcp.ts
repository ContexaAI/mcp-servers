import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { FeishuApiService } from '../services/feishuApiService.js';
import { Logger } from '../utils/logger.js';
import { registerFeishuTools } from './tools/feishuTools.js';
import { registerFeishuBlockTools } from './tools/feishuBlockTools.js';
import { registerFeishuFolderTools } from './tools/feishuFolderTools.js';

const serverInfo = {
  name: "Feishu MCP Server",
  version: "0.0.9",
};

const serverOptions = {
  capabilities: { logging: {}, tools: {} },
};

/**
 * Feishu MCP Service Class
 * Extends McpServer, provides Feishu tool registration and initialization functionality
 */
export class FeishuMcp extends McpServer {
  private feishuService: FeishuApiService | null = null;

  /**
   * Constructor
   */
  constructor() {
    super(serverInfo,serverOptions);
    
    // Initialize Feishu service
    this.initFeishuService();
    
    // Register all tools
    if (this.feishuService) {
      this.registerAllTools();
    } else {
      Logger.error('Cannot register Feishu tools: Feishu service initialization failed');
      throw new Error('Feishu service initialization failed');
    }
  }

  /**
   * Initialize Feishu API service
   */
  private initFeishuService(): void {
    try {
      // Use singleton pattern to get Feishu service instance
      this.feishuService = FeishuApiService.getInstance();
      Logger.info('Feishu service initialized successfully');
    } catch (error) {
      Logger.error('Feishu service initialization failed:', error);
      this.feishuService = null;
    }
  }

  /**
   * Register all Feishu MCP tools
   */
  private registerAllTools(): void {
    if (!this.feishuService) {
      return;
    }
    
    // Register all tools
    registerFeishuTools(this, this.feishuService);
    registerFeishuBlockTools(this, this.feishuService);
    registerFeishuFolderTools(this, this.feishuService);
  }
} 