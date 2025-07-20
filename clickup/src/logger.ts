import { createWriteStream } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import config, { LogLevel } from './config.js';

export { LogLevel };

const __dirname = dirname(fileURLToPath(import.meta.url));

const pid = process.pid;

const logFileName = 'server.log';
const logStream = createWriteStream(join(__dirname, logFileName), { flags: 'w' });
logStream.write(`Logging initialized to ${join(__dirname, logFileName)}\n`);

const configuredLevel = config.logLevel;

function isLevelEnabled(level: LogLevel): boolean {
  return level >= configuredLevel;
}

function log(level: 'trace' | 'debug' | 'info' | 'warn' | 'error', message: string, data?: any) {
  const levelEnum = level === 'trace' ? LogLevel.TRACE 
    : level === 'debug' ? LogLevel.DEBUG
    : level === 'info' ? LogLevel.INFO
    : level === 'warn' ? LogLevel.WARN 
    : LogLevel.ERROR;
  
  if (!isLevelEnabled(levelEnum)) {
    return;
  }
  
  const timestamp = new Date().toISOString();
  
  let logMessage = `[${timestamp}] [PID:${pid}] ${level.toUpperCase()}: ${message}`;
  
  if (data) {
    if (level === 'debug' || level === 'trace') {
      if (typeof data === 'object' && data !== null && !Array.isArray(data) && 
          Object.keys(data).length <= 4 && Object.keys(data).every(k => 
            typeof data[k] !== 'object' || data[k] === null)) {
        const dataStr = Object.entries(data)
          .map(([k, v]) => `${k}=${v === undefined ? 'undefined' : 
            (v === null ? 'null' : 
              (typeof v === 'string' ? `"${v}"` : v))}`)
          .join(' ');
        
        logMessage += ` (${dataStr})`;
      } else {
        logMessage += '\n' + JSON.stringify(data, null, 2);
      }
    } else {
      logMessage += '\n' + JSON.stringify(data, null, 2);
    }
  }

  logStream.write(logMessage + '\n');
}

export function info(message: string, data?: any) {
  log('info', message, data);
}

export function error(message: string, data?: any) {
  log('error', message, data);
}

export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  isLevelEnabled(level: LogLevel): boolean {
    return isLevelEnabled(level);
  }

  trace(message: string, data?: any) {
    log('trace', `[${this.context}] ${message}`, data);
  }

  debug(message: string, data?: any) {
    log('debug', `[${this.context}] ${message}`, data);
  }

  info(message: string, data?: any) {
    log('info', `[${this.context}] ${message}`, data);
  }

  warn(message: string, data?: any) {
    log('warn', `[${this.context}] ${message}`, data);
  }

  error(message: string, data?: any) {
    log('error', `[${this.context}] ${message}`, data);
  }
}

process.on('SIGTERM', () => {
  log('info', 'Received SIGTERM signal, shutting down gracefully...');
  logStream.end();
}); 