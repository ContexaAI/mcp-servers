#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Environment variables configuration in JSON format
const ENV_VARIABLES = [
  {
    "key": "AIRTABLE_API_KEY",
    "value": null,
    "required": false,
    "label": "AIRTABLE_API_KEY"
  },
  {
    "key": "PORT",
    "value": "8080",
    "required": false,
    "label": "PORT"
  },
  {
    "key": "SERVER_NAME",
    "value": "Contexa",
    "required": false,
    "label": "SERVER_NAME"
  },
  {
    "key": "SERVER_VERSION",
    "value": "0.1.0",
    "required": false,
    "label": "SERVER_VERSION"
  },
  {
    "key": "CONTEXA_TRACE_ENABLED",
    "value": "true",
    "required": false,
    "label": "CONTEXA_TRACE_ENABLED"
  },
  {
    "key": "CONTEXA_SERVER_ID",
    "value": "airtable-mcp-server",
    "required": false,
    "label": "CONTEXA_SERVER_ID"
  },
  {
    "key": "NODE_ENV",
    "value": "development",
    "required": false,
    "label": "NODE_ENV"
  },
  {
    "key": "DEBUG_MODE",
    "value": "false",
    "required": false,
    "label": "DEBUG_MODE"
  }
];

function generateEnvContent() {
  let content = `# Airtable API Configuration
# Required: Your Airtable personal access token
# Get your token from: https://airtable.com/create/tokens
AIRTABLE_API_KEY=pat123.abc123_your_actual_token_here

# Server Configuration
# Port number for the HTTP server
PORT=8080

# Server name shown in responses
SERVER_NAME=Contexa

# Server version
SERVER_VERSION=0.1.0

# Contexa Trace Configuration
# Enable/disable tracing middleware
CONTEXA_TRACE_ENABLED=true

# Server ID for tracing
CONTEXA_SERVER_ID=airtable-mcp-server

# Development Configuration
# Environment mode (development, production, test)
NODE_ENV=development

# Enable debug logging
DEBUG_MODE=false
`;

  return content;
}

function setupEnvFile() {
  const envPath = path.join(__dirname, '.env');
  
  // Check if .env file already exists
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env file already exists. Skipping creation.');
    console.log('If you want to recreate it, delete the existing .env file and run this script again.');
    return;
  }
  
  try {
    const envContent = generateEnvContent();
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully!');
    console.log('📝 Please edit the .env file and replace the placeholder values with your actual configuration.');
    console.log('🔑 Don\'t forget to set your AIRTABLE_API_KEY from: https://airtable.com/create/tokens');
  } catch (error) {
    console.error('❌ Failed to create .env file:', error.message);
  }
}

function showEnvConfig() {
  console.log('📋 Environment Variables Configuration:');
  console.log(JSON.stringify(ENV_VARIABLES, null, 2));
}

// Main execution
const command = process.argv[2];

switch (command) {
  case 'create':
    setupEnvFile();
    break;
  case 'config':
    showEnvConfig();
    break;
  default:
    console.log('🔧 Airtable MCP Server Environment Setup');
    console.log('');
    console.log('Usage:');
    console.log('  node setup-env.js create    - Create .env file from template');
    console.log('  node setup-env.js config    - Show environment variables configuration');
    console.log('');
    console.log('Environment Variables:');
    ENV_VARIABLES.forEach(envVar => {
      const required = envVar.required ? ' (Required)' : ' (Optional)';
      const defaultValue = envVar.value ? ` (Default: ${envVar.value})` : '';
      console.log(`  ${envVar.label}${required}${defaultValue}`);
    });
} 