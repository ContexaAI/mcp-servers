#!/usr/bin/env node

import type { McpToolContext } from './types'
import { runMain as _runMain, defineCommand } from 'citty'
import { version } from '../package.json'
import { createServer, stopServer } from './server'
import { deepwikiTool } from './tools/deepwiki'
import { deepwikiSearchTool } from './tools/deepwikiSearch'
import { contexaStart } from './contexa-server'

const cli = defineCommand({
  meta: {
    name: 'mcp-instruct',
    version,
    description: 'Run the MCP starter with stdio, http, or sse transport',
  },
  args: {
    http: { type: 'boolean', description: 'Run with HTTP transport' },
    sse: { type: 'boolean', description: 'Run with SSE transport' },
    stdio: { type: 'boolean', description: 'Run with stdio transport (default)' },
    port: { type: 'string', description: 'Port for http/sse (default 3000)', default: '3000' },
    endpoint: { type: 'string', description: 'HTTP endpoint (default /mcp)', default: '/mcp' },
  },
  async run({ args }) {
    const mcp = createServer({ name: 'my-mcp-server', version })

    process.on('SIGTERM', () => stopServer(mcp))
    process.on('SIGINT', () => stopServer(mcp))

    deepwikiTool({ mcp } as McpToolContext)
    // deepwikiSearchTool({ mcp } as McpToolContext)

    await contexaStart(mcp)
  },
})

export const runMain = () => _runMain(cli)

// ✅ Actually run the CLI
runMain()
