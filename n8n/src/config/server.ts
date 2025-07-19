/**
 * Server Configuration
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import { getEnvConfig } from './environment.js';
import { setupWorkflowTools } from '../tools/workflow/index.js';
import { setupExecutionTools } from '../tools/execution/index.js';
import { setupResourceHandlers } from '../resources/index.js';
import { createApiService } from '../api/n8n-client.js';
import { ToolCallResult } from '../types/index.js';

export async function configureServer(): Promise<Server> {
  const envConfig = getEnvConfig();
  
  const apiService = createApiService(envConfig);
  
  try {
    console.error('Verifying n8n API connectivity...');
    await apiService.checkConnectivity();
    console.error(`Successfully connected to n8n API at ${envConfig.n8nApiUrl}`);
  } catch (error) {
    console.warn('Warning: Failed to connect to n8n API:', error instanceof Error ? error.message : error);
    console.warn('Server will continue with limited functionality. API calls may fail.');
  }

  const server = new Server(
    {
      name: 'n8n-mcp-server',
      version: '0.1.0',
    },
    {
      capabilities: {
        resources: {},
        tools: {},
      },
    }
  );

  setupToolListRequestHandler(server);
  setupToolCallRequestHandler(server);
  setupResourceHandlers(server, envConfig);

  return server;
}

function setupToolListRequestHandler(server: Server): void {
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    const workflowTools = await setupWorkflowTools();
    const executionTools = await setupExecutionTools();

    return {
      tools: [...workflowTools, ...executionTools],
    };
  });
}

function setupToolCallRequestHandler(server: Server): void {
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const toolName = request.params.name;
    const args = request.params.arguments || {};

    let result: ToolCallResult;

    try {
      // Handle "prompts/list" as a special case, returning an empty success response
      // This is to address client calls for a method not central to n8n-mcp-server's direct n8n integration.
      if (toolName === 'prompts/list') {
        return {
          content: [{ type: 'text', text: 'Prompts list acknowledged.' }], // Or an empty array: content: []
          isError: false,
        };
      }

      // Import handlers
      const { 
        ListWorkflowsHandler, 
        GetWorkflowHandler,
        CreateWorkflowHandler,
        UpdateWorkflowHandler,
        DeleteWorkflowHandler,
        ActivateWorkflowHandler,
        DeactivateWorkflowHandler
      } = await import('../tools/workflow/index.js');
      
      const {
        ListExecutionsHandler,
        GetExecutionHandler,
        DeleteExecutionHandler,
        RunWebhookHandler
      } = await import('../tools/execution/index.js');
      
      // Route the tool call to the appropriate handler
      if (toolName === 'list_workflows') {
        const handler = new ListWorkflowsHandler();
        result = await handler.execute(args);
      } else if (toolName === 'get_workflow') {
        const handler = new GetWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'create_workflow') {
        const handler = new CreateWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'update_workflow') {
        const handler = new UpdateWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'delete_workflow') {
        const handler = new DeleteWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'activate_workflow') {
        const handler = new ActivateWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'deactivate_workflow') {
        const handler = new DeactivateWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'list_executions') {
        const handler = new ListExecutionsHandler();
        result = await handler.execute(args);
      } else if (toolName === 'get_execution') {
        const handler = new GetExecutionHandler();
        result = await handler.execute(args);
      } else if (toolName === 'delete_execution') {
        const handler = new DeleteExecutionHandler();
        result = await handler.execute(args);
      } else if (toolName === 'run_webhook') {
        const handler = new RunWebhookHandler();
        result = await handler.execute(args);
      } else {
        throw new Error(`Unknown tool: ${toolName}`);
      }

      // Converting to MCP SDK expected format
      return {
        content: result.content,
        isError: result.isError,
      };
    } catch (error) {
      console.error(`Error handling tool call to ${toolName}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
        isError: true,
      };
    }
  });
}
