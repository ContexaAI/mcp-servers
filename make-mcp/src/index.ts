#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { Make } from './make.js';
import { remap } from './utils.js';
import { contexaStart } from './contexa-server.js';

const server = new Server(
    {
        name: 'Make',
        version: '0.1.0',
    },
    {
        capabilities: {
            tools: {},
        },
    },
);

const makeApiKey = process.env.MAKE_API_KEY;
const makeZone = process.env.MAKE_ZONE;
const makeTeam = process.env.MAKE_TEAM;

if (!makeApiKey) {
    console.warn('Please provide MAKE_API_KEY environment variable.');
}
if (!makeZone) {
    console.warn('Please provide MAKE_ZONE environment variable.');
}
if (!makeTeam) {
    console.warn('Please provide MAKE_TEAM environment variable.');
}

const make = (makeApiKey && makeZone) ? new Make(makeApiKey, makeZone) : undefined;
const teamId = makeTeam ? parseInt(makeTeam) : undefined;

server.setRequestHandler(ListToolsRequestSchema, async () => {
    if (!make || teamId === undefined) {
        console.warn('Make client or teamId is not configured. Returning empty tool list.');
        return { tools: [] };
    }
    const scenarios = await make.scenarios.list(teamId);
    return {
        tools: await Promise.all(
            scenarios
                .filter(scenario => scenario.scheduling.type === 'on-demand')
                .map(async scenario => {
                    const inputs = (await make.scenarios.interface(scenario.id)).input;
                    return {
                        name: `run_scenario_${scenario.id}`,
                        description: scenario.name + (scenario.description ? ` (${scenario.description})` : ''),
                        inputSchema: remap({
                            name: 'wrapper',
                            type: 'collection',
                            spec: inputs,
                        }),
                    };
                }),
        ),
    };
});

server.setRequestHandler(CallToolRequestSchema, async request => {
    if (!make) {
        return {
            isError: true,
            content: [
                {
                    type: 'text',
                    text: 'Make client is not configured. Cannot run scenario.'
                }
            ]
        };
    }
    if (/^run_scenario_\d+$/.test(request.params.name)) {
        try {
            const output = (
                await make.scenarios.run(parseInt(request.params.name.substring(13)), request.params.arguments)
            ).outputs;

            return {
                content: [
                    {
                        type: 'text',
                        text: output ? JSON.stringify(output, null, 2) : 'Scenario executed successfully.',
                    },
                ],
            };
        } catch (err: unknown) {
            return {
                isError: true,
                content: [
                    {
                        type: 'text',
                        text: String(err),
                    },
                ],
            };
        }
    }
    throw new Error(`Unknown tool: ${request.params.name}`);
});

await contexaStart(server);
