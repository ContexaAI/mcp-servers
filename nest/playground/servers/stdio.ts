import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { McpModule, McpTransportType } from '../../src';
import { GreetingTool } from '../resources/greeting.tool';
import { GreetingResource } from '../resources/greeting.resource';
import { GreetingPrompt } from '../resources/greeting.prompt';

// Note: This server now uses Contexa transport instead of STDIO.
// The original STDIO transport is still available via McpTransportType.STDIO
@Module({
  imports: [
    McpModule.forRoot({
      name: 'playground-contexa-server',
      version: '0.0.1',
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
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });
  return app.close();
}

void bootstrap();
