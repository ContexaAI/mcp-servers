import { Api } from '@neondatabase/api-client';
import { AuthContext } from '../types/auth.js';

// Simplified tool handler types to avoid circular dependencies
export type ToolHandlerExtraParams = {
  account: AuthContext['extra']['account'];
};

// Simple function type that matches the actual usage pattern
export type ToolHandlerExtended<T = any> = (
  args: { [key: string]: any },
  neonClient: Api<unknown>,
  extraParams: ToolHandlerExtraParams,
) => Promise<any>;

// Individual tool handler types are available via ToolHandlerExtended<T>
// where T is the specific tool name
