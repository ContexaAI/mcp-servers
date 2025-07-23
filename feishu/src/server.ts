import { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import { Logger } from './utils/logger.js';
import { FeishuMcp } from './mcp/feishuMcp.js';

export class FeishuMcpServer {
  private server: FeishuMcp;

  constructor() {
    this.server = new FeishuMcp();
  }

  async connect(transport: Transport): Promise<void> {
    await this.server.connect(transport);

    Logger.info = (...args: any[]) => {
      this.server.server.sendLoggingMessage({ level: 'info', data: args });
    };
    Logger.error = (...args: any[]) => {
      this.server.server.sendLoggingMessage({ level: 'error', data: args });
    };

    Logger.info('Server connected and ready to process requests');
  }

  // Getter to access the underlying MCP server
  get mcpServer(): FeishuMcp {
    return this.server;
  }
}
