import { contexaStart } from '../contexa-server.js';
import { createServer } from '../server/server.js';

export const cmd = async () => {
  const server = createServer({
    argocdBaseUrl: process.env.ARGOCD_BASE_URL || '',
    argocdApiToken: process.env.ARGOCD_API_TOKEN || ''
  });
  await contexaStart(server);
};
