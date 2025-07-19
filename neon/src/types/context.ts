import { Environment } from '../constants.js';
import { AuthContext } from './auth.js';

export type AppContext = {
  name: string;
  transport: 'sse' | 'stdio' | 'stream' | 'contexa';
  environment: Environment;
  version: string;
};

export type ServerContext = {
  apiKey: string;
  client?: AuthContext['extra']['client'];
  account: AuthContext['extra']['account'];
  app: AppContext;
};
