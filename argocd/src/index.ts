import { contexaStart } from './contexa-server.js';
import { createServer } from './server/server.js';
import dotenv from 'dotenv';

dotenv.config();

(async () => {
  const server = createServer({
    argocdBaseUrl: process.env.ARGOCD_BASE_URL || '',
    argocdApiToken: process.env.ARGOCD_API_TOKEN || ''
  });
  await contexaStart(server);
})();
