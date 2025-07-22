# MCP-Nest Playground

A quick-start environment for testing and exploring MCP-Nest features without building a full application.

## Quick Start

### Option 1: Test with MCP Inspector (Recommended)

MCP Inspector provides a web-based UI to interact with your MCP server - perfect for testing tools, resources, and prompts visually.

#### For Contexa Transport (Recommended)

```bash
# 1. Start the Contexa server
npx ts-node-dev --respawn ./playground/servers/contexa.ts

# 2. Launch MCP Inspector
npx @modelcontextprotocol/inspector

# 3. In your browser at http://127.0.0.1:6274:
#    - Set Transport Type to: Streamable HTTP
#    - Set URL to: http://localhost:8080/mcp
```

#### For HTTP+SSE Transport (Legacy - Stateful Server)

```bash
# 1. Start the stateful server
npx ts-node-dev --respawn ./playground/servers/server-stateful.ts

# 2. Launch MCP Inspector
npx @modelcontextprotocol/inspector

# 3. In your browser at http://127.0.0.1:6274:
#    - Set Transport Type to: SSE
#    - Set URL to: http://localhost:3030/sse
```

#### For Streamable HTTP Transport (Legacy)

```bash
# 1. Start the server (stateful or stateless)
npx ts-node-dev --respawn ./playground/servers/server-stateful.ts
# OR
npx ts-node-dev --respawn ./playground/servers/server-stateless.ts

# 2. Launch MCP Inspector
npx @modelcontextprotocol/inspector

# 3. In your browser at http://127.0.0.1:6274:
#    - Set Transport Type to: Streamable HTTP
#    - Set URL to: http://localhost:3030/mcp
```

#### For STDIO Transport (Legacy)

```bash
# 1. Run the MCP Inspector and configure it to use the STDIO server
npx @modelcontextprotocol/inspector@0.13.0 npx ts-node-dev --respawn playground/servers/stdio.ts

# 2. In your browser:
#    - Set Transport Type to: stdio
```

### Option 2: Test with Code Clients

Use code clients when you need to:

- Automate testing
- Build custom integrations
- Test specific scenarios programmatically

```bash
# Start your server first (choose one):
npx ts-node-dev --respawn ./playground/servers/contexa.ts
npx ts-node-dev --respawn ./playground/servers/server-stateful.ts
npx ts-node-dev --respawn ./playground/servers/server-stateless.ts

# Then run a client:
# For Contexa (Streamable HTTP)
npx ts-node-dev --respawn ./playground/clients/http-streamable-client.ts

# For HTTP+SSE (stateful server only)
npx ts-node-dev --respawn ./playground/clients/http-sse.ts

# For STDIO
npx ts-node-dev --respawn ./playground/clients/stdio-client.ts
```

## Migration Guide

### From Old Transports to Contexa

The Contexa transport provides a unified HTTP-based transport that replaces the need for separate SSE and Streamable HTTP implementations. Here's how to migrate:

#### Before (Old Transport)
```typescript
@Module({
  imports: [
    McpModule.forRoot({
      name: 'my-mcp-server',
      version: '0.0.1',
      transport: McpTransportType.STREAMABLE_HTTP,
      streamableHttp: {
        enableJsonResponse: true,
        sessionIdGenerator: undefined,
        statelessMode: true,
      },
    }),
  ],
  providers: [MyTool, MyResource, MyPrompt],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3030); // Old way - manual server startup
  console.log('MCP server started on port 3030');
}
```

#### After (Contexa Transport)
```typescript
@Module({
  imports: [
    McpModule.forRoot({
      name: 'my-mcp-server',
      version: '0.0.1',
      transport: McpTransportType.CONTEXA,
      contexa: {
        port: 8080,
        cors: true,
      },
    }),
  ],
  providers: [MyTool, MyResource, MyPrompt],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });
  return app.close(); // Contexa handles server startup automatically
}
```

### Key Changes

1. **Transport Type**: Change from `McpTransportType.STREAMABLE_HTTP` to `McpTransportType.CONTEXA`
2. **Configuration**: Replace `streamableHttp` config with `contexa` config
3. **Server Startup**: Remove `app.listen()` calls - Contexa handles this automatically
4. **Application Type**: Use `createApplicationContext()` instead of `create()` for better integration
