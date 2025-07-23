import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { McpModule, McpTransportType } from '../../src';
import { GreetingTool } from '../resources/greeting.tool';
import { GreetingResource } from '../resources/greeting.resource';
import { GreetingPrompt } from '../resources/greeting.prompt';

/**
 * Migration Example: From Old Transports to Contexa
 * 
 * OLD PATTERN (commented out):
 * - Uses McpTransportType.STREAMABLE_HTTP
 * - Requires manual app.listen() call
 * - Separate configuration for streamableHttp
 * 
 * NEW PATTERN (active):
 * - Uses McpTransportType.CONTEXA  
 * - No manual server startup needed
 * - Unified contexa configuration
 * - Automatic transport management
 */

@Module({
  imports: [
    McpModule.forRoot({
      name: 'migration-example-server',
      version: '0.0.1',
      
      // OLD: transport: McpTransportType.STREAMABLE_HTTP,
      // OLD: streamableHttp: {
      // OLD:   enableJsonResponse: true,
      // OLD:   sessionIdGenerator: undefined,
      // OLD:   statelessMode: true,
      // OLD: },
      
      // NEW: Contexa transport
      transport: McpTransportType.CONTEXA,
      contexa: {
        port: 8080,
        cors: true,
      },
    }),
  ],
  providers: [GreetingTool, GreetingPrompt, GreetingResource],
})
class AppModule {}

async function bootstrap() {
  // OLD: const app = await NestFactory.create(AppModule);
  // OLD: await app.listen(3030);
  // OLD: console.log('MCP server started on port 3030');
  
  // NEW: Use ApplicationContext and let Contexa handle server startup
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });
  
  // Contexa automatically starts the HTTP server and handles MCP transport
  // No need for manual server.listen() calls
  
  return app.close();
}

void bootstrap(); 