/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { zodToJsonSchema } from 'zod-to-json-schema';
export async function connect(serverBackendFactory, transport) {
    const backend = serverBackendFactory();
    await backend.initialize?.();
    const server = createServer(backend);
    await server.connect(transport);
}
export function createServer(backend) {
    const server = new Server({ name: backend.name, version: backend.version }, {
        capabilities: {
            tools: {},
        }
    });
    const tools = backend.tools();
    server.setRequestHandler(ListToolsRequestSchema, async () => {
        return { tools: tools.map(tool => ({
                name: tool.name,
                description: tool.description,
                inputSchema: zodToJsonSchema(tool.inputSchema),
                annotations: {
                    title: tool.title,
                    readOnlyHint: tool.type === 'readOnly',
                    destructiveHint: tool.type === 'destructive',
                    openWorldHint: true,
                },
            })) };
    });
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const errorResult = (...messages) => ({
            content: [{ type: 'text', text: messages.join('\n') }],
            isError: true,
        });
        const tool = tools.find(tool => tool.name === request.params.name);
        if (!tool)
            return errorResult(`Tool "${request.params.name}" not found`);
        try {
            return await backend.callTool(tool, tool.inputSchema.parse(request.params.arguments || {}));
        }
        catch (error) {
            return errorResult(String(error));
        }
    });
    if (backend.serverInitialized)
        server.oninitialized = () => backend.serverInitialized(server.getClientVersion());
    if (backend.serverClosed)
        server.onclose = () => backend.serverClosed();
    return server;
}
