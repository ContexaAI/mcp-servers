# NestJS MCP Server Module

<div align="center">
  <img src="https://raw.githubusercontent.com/rekog-labs/MCP-Nest/main/image.png" height="200">

[![CI][ci-image]][ci-url]
[![Code Coverage][code-coverage-image]][code-coverage-url]
[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-url]
[![NPM License][npm-license-image]][npm-url]

</div>

A NestJS module to effortlessly expose tools, resources, and prompts for AI, from your NestJS applications using the **Model Context Protocol (MCP)**.

With `@rekog/mcp-nest` you define tools, resources, and prompts in a way that's familiar in NestJS and leverage the full power of dependency injection to utilize your existing codebase in building complex enterprise ready MCP servers.

## Features

- 🚀 **Contexa Transport** - Unified HTTP-based transport for MCP servers
- 🔍 Automatic `tool`, `resource`, and `prompt` discovery and registration
- 💯 Zod-based tool call validation
- 📊 Progress notifications
- 🔒 Guard-based authentication
- 🌐 Access to HTTP Request information within MCP Resources (Tools, Resources, Prompts)

## Installation

```bash
npm install @rekog/mcp-nest @modelcontextprotocol/sdk zod
```

## Quick Start

### 1. Import Module

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { McpModule } from '@rekog/mcp-nest';
import { GreetingTool } from './greeting.tool';

@Module({
  imports: [
    McpModule.forRoot({
      name: 'my-mcp-server',
      version: '1.0.0',
    }),
  ],
  providers: [GreetingTool],
})
export class AppModule {}
```

### 2. Define Tools and Resource

```typescript
// greeting.tool.ts
import type { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { Tool, Resource, Context } from '@rekog/mcp-nest';
import { z } from 'zod';
import { Progress } from '@modelcontextprotocol/sdk/types';

@Injectable()
export class GreetingTool {
  constructor() {}

  @Tool({
    name: 'hello-world',
    description:
      'Returns a greeting and simulates a long operation with progress updates',
    parameters: z.object({
      name: z.string().default('World'),
    }),
  })
  async sayHello({ name }, context: Context, request: Request) {
    const userAgent = request.get('user-agent') || 'Unknown';
    const greeting = `Hello, ${name}! Your user agent is: ${userAgent}`;
    const totalSteps = 5;
    for (let i = 0; i < totalSteps; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Send a progress update.
      await context.reportProgress({
        progress: (i + 1) * 20,
        total: 100,
      } as Progress);
    }

    return {
      content: [{ type: 'text', text: greeting }],
    };
  }

  @Resource({
    uri: 'mcp://hello-world/{userName}',
    name: 'Hello World',
    description: 'A simple greeting resource',
    mimeType: 'text/plain',
  })
  // Different from the SDK, we put the parameters and URI in the same object.
  async getCurrentSchema({ uri, userName }) {
    return {
      content: [
        {
          uri,
          text: `User is ${userName}`,
          mimeType: 'text/plain',
        },
      ],
    };
  }
}
```

You are done!

> [!TIP]
> The above example shows how HTTP `Request` headers are accessed within MCP Tools. This is useful for identifying users, adding client-specific logic, and many other use cases. For more examples, see the [Authentication Tests](./tests/mcp-tool-auth.e2e.spec.ts).

## Quick Start for STDIO

The main difference is that you need to provide the `transport` option when importing the module.

```typescript
McpModule.forRoot({
  name: 'playground-stdio-server',
  version: '0.0.1',
  transport: McpTransportType.STDIO,
});
```

The rest is the same, you can define tools, resources, and prompts as usual. An example of a standalone NestJS application using the STDIO transport is the following:

```typescript
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });
  return app.close();
}

void bootstrap();
```

Next, you can use the MCP server with an MCP Stdio Client ([see example](playground/clients/stdio-client.ts)), or after building your project you can use it with the following MCP Client configuration:

```json
{
  "mcpServers": {
    "greeting": {
      "command": "node",
      "args": [
        "<path to dist js file>",
      ]
    }
  }
}
```

## Start Scripts

The project includes start scripts to run the Contexa transport server:

### Available Scripts

- `npm start` - Start the Contexa transport server
- `npm run dev` - Start the Contexa transport server (alias for start)

### Quick Start with Contexa Transport

```bash
# Install dependencies
npm install

# Start the Contexa server
npm start

# Or use the dev alias
npm run dev
```

The server will start on `http://localhost:8080` with the following endpoints:
- `GET /health` - Health check
- `POST /mcp` - MCP operations endpoint

## API Endpoints

Contexa transport exposes the following endpoints:

- `GET /health` - Health check endpoint
- `POST /mcp` - Main endpoint for all MCP operations (tool execution, resource access, etc.)

### Tips

It's possible to use the module with global prefix, but the recommended way is to exclude those endpoints with:

```typescript
app.setGlobalPrefix('/api', { exclude: ['health', 'mcp'] });
```

## Authentication

You can secure your MCP endpoints using standard NestJS Guards.

### 1. Create a Guard

Implement the `CanActivate` interface. The guard should handle request validation (e.g., checking JWTs, API keys) and optionally attach user information to the request object.

Nothing special, check the NestJS documentation for more details.

### 2. Apply the Guard

Pass your guard(s) to the `McpModule.forRoot` configuration. The guard(s) will be applied to the Contexa transport endpoints.

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { McpModule } from '@rekog/mcp-nest';
import { GreetingTool } from './greeting.tool';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    McpModule.forRoot({
      name: 'my-mcp-server',
      version: '1.0.0',
      guards: [AuthGuard], // Apply the guard here
    }),
  ],
  providers: [GreetingTool, AuthGuard], // Ensure the Guard is also provided
})
export class AppModule {}
```

That's it! The rest is the same as NestJS Guards.

## Playground

The `playground` directory contains examples to quickly test MCP and `@rekog/mcp-nest` features.
Refer to the [`playground/README.md`](playground/README.md) for more details.

## Configuration

The `McpModule.forRoot()` method accepts an `McpOptions` object to configure the server. Here are the available options:

| Option             | Description                                                                                                                               | Default                                                              |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `name`             | **Required.** The name of your MCP server.                                                                                                | -                                                                    |
| `version`          | **Required.** The version of your MCP server.                                                                                             | -                                                                    |
| `capabilities`     | Optional MCP server capabilities to advertise. See [@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk). | `undefined`                                                          |
| `instructions`     | Optional instructions for the client on how to interact with the server.                                                                    | `undefined`                                                          |
| `transport`        | Specifies the transport type to enable.                                                                                                   | `McpTransportType.CONTEXA`                                           |
| `apiPrefix`        | A prefix for all MCP endpoints. Useful if integrating into an existing application.                                                        | `''`                                                                 |
| `guards`           | An array of NestJS Guards to apply to the MCP endpoints for authentication/authorization.                                                   | `[]`                                                                 |
| `decorators`       | An array of NestJS Class Decorators to apply to the generated MCP controllers.                                                            | `[]`                                                                 |
| `contexa`          | Configuration specific to the Contexa transport.                                                                                          | `{ port: 8080, cors: true }`                                         |
| `contexa.port`     | The port number for the Contexa HTTP server.                                                                                              | `8080`                                                               |
| `contexa.cors`     | Whether to enable CORS for the Contexa HTTP server.                                                                                       | `true`                                                               |

<!-- Badges -->
[ci-url]: https://github.com/rekog-labs/MCP-Nest/actions/workflows/pipeline.yml
[ci-image]: https://github.com/rekog-labs/MCP-Nest/actions/workflows/pipeline.yml/badge.svg
[npm-url]: https://www.npmjs.com/package/@rekog/mcp-nest
[npm-version-image]: https://img.shields.io/npm/v/@rekog/mcp-nest
[npm-downloads-image]: https://img.shields.io/npm/dm/@rekog/mcp-nest
[npm-license-image]: https://img.shields.io/npm/l/@rekog/mcp-nest
[code-coverage-url]: https://codecov.io/gh/rekog-labs/mcp-nest
[code-coverage-image]: https://codecov.io/gh/rekog-labs/mcp-nest/branch/main/graph/badge.svg
