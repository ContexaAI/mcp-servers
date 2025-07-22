import { startMcpServer } from './server.js';
import { contexaStart } from './contexa-server.js';

// Check for required environment variables
if (!process.env.YOUTUBE_API_KEY) {
    console.error('Error: YOUTUBE_API_KEY environment variable is required.');
    console.error('Please set it before running this server.');
    // process.exit(1); // Removed to allow execution to continue
}

// Start the MCP server with Contexa transport
startMcpServer()
    .then(async (server) => {
        await contexaStart(server);
        console.log('YouTube MCP Server started successfully (Contexa transport)');
    })
    .catch(error => {
        console.error('Failed to start YouTube MCP Server:', error);
        // process.exit(1); // Removed to allow execution to continue
    });
