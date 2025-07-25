# Contexa MCP Server Setup ✅

This document describes how to use the Supabase MCP server with Contexa transport.

## ✅ Installation Complete

All required dependencies and build configurations are properly set up:

### Runtime Dependencies
- `express` - Web server framework
- `cors` - Cross-Origin Resource Sharing middleware  
- `mcp-trace` - Tracing middleware for debugging

### Development Dependencies
- `@types/express` - TypeScript types for Express
- `@types/cors` - TypeScript types for CORS

## 🚀 Ready to Use Commands

### Start the Server (RECOMMENDED)
```bash
# Build and start the server
npm run start:contexa

# Or just start (if already built)
npm run start

# With access token
npm run start -- --access-token YOUR_TOKEN
```

### Development
```bash
# Build the project
npm run build

# Development with auto-rebuild on file changes
npm run dev:watch

# Quick development (build once and start)
npm run dev
```

## Usage

### Environment Variables
Set the following environment variable:
```bash
export SUPABASE_ACCESS_TOKEN=your_supabase_access_token
```

Or use CLI arguments:
```bash
npm run start -- --access-token your_token --project-ref your_project_id
```

### Server Endpoints
Once started, the server will be available at:
- Main endpoint: `http://localhost:8080/mcp`
- Health check: `http://localhost:8080/health`

## Quick Start

1. **Set your access token:**
   ```bash
   export SUPABASE_ACCESS_TOKEN=your_token_here
   ```

2. **Start the server:**
   ```bash
   npm run start:contexa
   ```

3. **Or start with arguments:**
   ```bash
   npm run start -- --access-token your_token --project-ref your_project_id
   ```

## Error Handling

The server includes comprehensive error handling for:
- ✅ Server startup failures
- ✅ Transport initialization errors  
- ✅ Request processing errors
- ✅ Tracing middleware failures (graceful fallback)

## Features

- ✅ Contexa transport integration
- ✅ Express web server
- ✅ CORS support
- ✅ Request tracing (optional)
- ✅ Comprehensive error handling
- ✅ TypeScript support
- ✅ SQL file handling in build process
