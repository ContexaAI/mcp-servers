// Environment variables configuration
export const ENV_VARIABLES = [
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

// Function to validate and get environment variables
export const getEnvConfig = () => {
  const config: Record<string, string> = {};
  
  for (const envVar of ENV_VARIABLES) {
    const value = process.env[envVar.key];
    
    if (!value && envVar.key === 'AIRTABLE_API_KEY') {
      console.warn(`⚠️  Warning: ${envVar.label} environment variable is not set.`);
      console.warn(`The server will start but Airtable operations may fail.`);
      console.warn(`To set up ${envVar.label}, add it to your .env file or environment variables.`);
      console.warn(`Get your Airtable token from: https://airtable.com/create/tokens`);
    }
    
    config[envVar.key] = value || envVar.value || '';
  }
  
  return config;
};

// Function to get a specific environment variable
export const getEnvVar = (key: string, defaultValue?: string): string => {
  const envVar = ENV_VARIABLES.find(v => v.key === key);
  if (!envVar) {
    console.warn(`⚠️  Warning: Unknown environment variable: ${key}`);
    return defaultValue || '';
  }
  
  return process.env[key] || envVar.value || defaultValue || '';
};

// Function to check if an environment variable is set
export const isEnvVarSet = (key: string): boolean => {
  return !!process.env[key];
};

// Function to validate all environment variables (all optional now)
export const validateEnvVars = (): void => {
  const missingVars = ENV_VARIABLES
    .filter(envVar => !process.env[envVar.key])
    .map(envVar => envVar.label);
  
  if (missingVars.length > 0) {
    console.warn(`⚠️  Warning: Missing environment variables: ${missingVars.join(', ')}`);
    console.warn('The server will start with default values, but some features may not work properly.');
  }
}; 