import { runServer } from './server.js';

runServer(process.argv.includes('--debug')).catch(err => {
  console.error('FATAL: failed to start', err);
  process.exit(1);
}); 