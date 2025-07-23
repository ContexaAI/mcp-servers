import { Logger } from './logger.js';
import { LogLevel } from './logger.js';

/**
 * Configuration source enumeration
 */
export enum ConfigSource {
  DEFAULT = 'default',
  ENV = 'env',
  CLI = 'cli',
  FILE = 'file'
}

/**
 * Server configuration interface
 */
export interface ServerConfig {
  port: number;
}

/**
 * Feishu configuration interface
 */
export interface FeishuConfig {
  appId: string;
  appSecret: string;
  baseUrl: string;
  authType: 'tenant' | 'user';
  tokenEndpoint: string;
}

/**
 * Log configuration interface
 */
export interface LogConfig {
  level: LogLevel;
  showTimestamp: boolean;
  showLevel: boolean;
  timestampFormat: string;
}

/**
 * Cache configuration interface
 */
export interface CacheConfig {
  enabled: boolean;
  ttl: number; // in seconds
  maxSize: number; // maximum cache entries
}

/**
 * Configuration management class
 * Provides centralized configuration management with support for multiple sources
 */
export class Config {
  private static instance: Config;

  public readonly server: ServerConfig;
  public readonly feishu: FeishuConfig;
  public readonly log: LogConfig;
  public readonly cache: CacheConfig;

  public readonly configSources: {
    [key: string]: ConfigSource;
  };

  /**
   * Private constructor for singleton pattern
   */
  private constructor() {
    this.configSources = {};
    
    // Parse command line arguments
    const argv = this.parseCommandLineArgs();
    
    // Initialize configurations
    this.server = this.initServerConfig(argv);
    this.feishu = this.initFeishuConfig(argv);
    this.log = this.initLogConfig(argv);
    this.cache = this.initCacheConfig(argv);
  }

  /**
   * Get singleton instance
   * @returns Configuration instance
   */
  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  /**
   * Parse command line arguments
   * @returns Parsed arguments object
   */
  private parseCommandLineArgs(): any {
    const args = process.argv.slice(2);
    const parsed: any = {};

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      
      if (arg.startsWith('--')) {
        const key = arg.slice(2);
        const value = args[i + 1];
        
        if (value && !value.startsWith('--')) {
          // Handle boolean values
          if (value === 'true' || value === 'false') {
            parsed[key] = value === 'true';
          } else if (!isNaN(Number(value))) {
            parsed[key] = Number(value);
          } else {
            parsed[key] = value;
          }
          i++; // Skip the next argument since we used it
        } else {
          // Flag without value, treat as true
          parsed[key] = true;
        }
      }
    }

    return parsed;
  }

  /**
   * Initialize server configuration
   * @param argv Command line arguments
   * @returns Server configuration
   */
  private initServerConfig(argv: any): ServerConfig {
    const serverConfig: ServerConfig = {
      port: 8080,
    };
    
    // Handle PORT
    if (argv.port) {
      serverConfig.port = argv.port;
      this.configSources['server.port'] = ConfigSource.CLI;
    } else if (process.env.PORT) {
      serverConfig.port = parseInt(process.env.PORT, 10);
      this.configSources['server.port'] = ConfigSource.ENV;
    } else {
      this.configSources['server.port'] = ConfigSource.DEFAULT;
    }
    return serverConfig;
  }
  
  /**
   * Initialize Feishu configuration
   * @param argv Command line arguments
   * @returns Feishu configuration
   */
  private initFeishuConfig(argv: any): FeishuConfig {
    // Initialize serverConfig first to get port
    const serverConfig = this.server || this.initServerConfig(argv);
    const feishuConfig: FeishuConfig = {
      appId: '',
      appSecret: '',
      baseUrl: 'https://open.feishu.cn/open-apis',
      authType: 'tenant', // default
      tokenEndpoint: `http://127.0.0.1:${serverConfig.port}/getToken`, // default dynamic port
    };
    
    // Handle App ID
    if (argv['feishu-app-id']) {
      feishuConfig.appId = argv['feishu-app-id'];
      this.configSources['feishu.appId'] = ConfigSource.CLI;
    } else if (process.env.FEISHU_APP_ID) {
      feishuConfig.appId = process.env.FEISHU_APP_ID;
      this.configSources['feishu.appId'] = ConfigSource.ENV;
    }
    
    // Handle App Secret
    if (argv['feishu-app-secret']) {
      feishuConfig.appSecret = argv['feishu-app-secret'];
      this.configSources['feishu.appSecret'] = ConfigSource.CLI;
    } else if (process.env.FEISHU_APP_SECRET) {
      feishuConfig.appSecret = process.env.FEISHU_APP_SECRET;
      this.configSources['feishu.appSecret'] = ConfigSource.ENV;
    }
    
    // Handle Base URL
    if (argv['feishu-base-url']) {
      feishuConfig.baseUrl = argv['feishu-base-url'];
      this.configSources['feishu.baseUrl'] = ConfigSource.CLI;
    } else if (process.env.FEISHU_BASE_URL) {
      feishuConfig.baseUrl = process.env.FEISHU_BASE_URL;
      this.configSources['feishu.baseUrl'] = ConfigSource.ENV;
    } else {
      this.configSources['feishu.baseUrl'] = ConfigSource.DEFAULT;
    }

    // Handle authType
    if (argv['feishu-auth-type']) {
      feishuConfig.authType = argv['feishu-auth-type'] === 'user' ? 'user' : 'tenant';
      this.configSources['feishu.authType'] = ConfigSource.CLI;
    } else if (process.env.FEISHU_AUTH_TYPE) {
      feishuConfig.authType = process.env.FEISHU_AUTH_TYPE === 'user' ? 'user' : 'tenant';
      this.configSources['feishu.authType'] = ConfigSource.ENV;
    } else {
      this.configSources['feishu.authType'] = ConfigSource.DEFAULT;
    }
    
    // Handle tokenEndpoint
    if (argv['feishu-token-endpoint']) {
      feishuConfig.tokenEndpoint = argv['feishu-token-endpoint'];
      this.configSources['feishu.tokenEndpoint'] = ConfigSource.CLI;
    } else if (process.env.FEISHU_TOKEN_ENDPOINT) {
      feishuConfig.tokenEndpoint = process.env.FEISHU_TOKEN_ENDPOINT;
      this.configSources['feishu.tokenEndpoint'] = ConfigSource.ENV;
    } else {
      this.configSources['feishu.tokenEndpoint'] = ConfigSource.DEFAULT;
    }
    
    return feishuConfig;
  }
  
  /**
   * Initialize log configuration
   * @param argv Command line arguments
   * @returns Log configuration
   */
  private initLogConfig(argv: any): LogConfig {
    const logConfig: LogConfig = {
      level: LogLevel.INFO,
      showTimestamp: true,
      showLevel: true,
      timestampFormat: 'yyyy-MM-dd HH:mm:ss.SSS'
    };
    
    // Handle log level
    if (argv['log-level']) {
      logConfig.level = this.getLogLevelFromString(argv['log-level']);
      this.configSources['log.level'] = ConfigSource.CLI;
    } else if (process.env.LOG_LEVEL) {
      logConfig.level = this.getLogLevelFromString(process.env.LOG_LEVEL);
      this.configSources['log.level'] = ConfigSource.ENV;
    } else {
      this.configSources['log.level'] = ConfigSource.DEFAULT;
    }
    
    // Handle timestamp display
    if (process.env.LOG_SHOW_TIMESTAMP) {
      logConfig.showTimestamp = process.env.LOG_SHOW_TIMESTAMP.toLowerCase() === 'true';
      this.configSources['log.showTimestamp'] = ConfigSource.ENV;
    } else {
      this.configSources['log.showTimestamp'] = ConfigSource.DEFAULT;
    }
    
    // Handle level display
    if (process.env.LOG_SHOW_LEVEL) {
      logConfig.showLevel = process.env.LOG_SHOW_LEVEL.toLowerCase() === 'true';
      this.configSources['log.showLevel'] = ConfigSource.ENV;
    } else {
      this.configSources['log.showLevel'] = ConfigSource.DEFAULT;
    }
    
    // Handle timestamp format
    if (process.env.LOG_TIMESTAMP_FORMAT) {
      logConfig.timestampFormat = process.env.LOG_TIMESTAMP_FORMAT;
      this.configSources['log.timestampFormat'] = ConfigSource.ENV;
    } else {
      this.configSources['log.timestampFormat'] = ConfigSource.DEFAULT;
    }
    
    return logConfig;
  }
  
  /**
   * Initialize cache configuration
   * @param argv Command line arguments
   * @returns Cache configuration
   */
  private initCacheConfig(argv: any): CacheConfig {
    const cacheConfig: CacheConfig = {
      enabled: true,
      ttl: 300, // 5 minutes, in seconds
      maxSize: 100
    };
    
    // Handle cache enable
    if (argv['cache-enabled'] !== undefined) {
      cacheConfig.enabled = argv['cache-enabled'];
      this.configSources['cache.enabled'] = ConfigSource.CLI;
    } else if (process.env.CACHE_ENABLED) {
      cacheConfig.enabled = process.env.CACHE_ENABLED.toLowerCase() === 'true';
      this.configSources['cache.enabled'] = ConfigSource.ENV;
    } else {
      this.configSources['cache.enabled'] = ConfigSource.DEFAULT;
    }
    
    // Handle TTL
    if (argv['cache-ttl']) {
      cacheConfig.ttl = argv['cache-ttl'];
      this.configSources['cache.ttl'] = ConfigSource.CLI;
    } else if (process.env.CACHE_TTL) {
      cacheConfig.ttl = parseInt(process.env.CACHE_TTL, 10);
      this.configSources['cache.ttl'] = ConfigSource.ENV;
    } else {
      this.configSources['cache.ttl'] = ConfigSource.DEFAULT;
    }
    
    // Handle maximum cache size
    if (process.env.CACHE_MAX_SIZE) {
      cacheConfig.maxSize = parseInt(process.env.CACHE_MAX_SIZE, 10);
      this.configSources['cache.maxSize'] = ConfigSource.ENV;
    } else {
      this.configSources['cache.maxSize'] = ConfigSource.DEFAULT;
    }
    
    return cacheConfig;
  }
  
  /**
   * Get log level from string
   * @param levelStr Log level string
   * @returns Log level enum value
   */
  private getLogLevelFromString(levelStr: string): LogLevel {
    switch (levelStr.toLowerCase()) {
      case 'debug': return LogLevel.DEBUG;
      case 'info': return LogLevel.INFO;
      case 'log': return LogLevel.LOG;
      case 'warn': return LogLevel.WARN;
      case 'error': return LogLevel.ERROR;
      case 'none': return LogLevel.NONE;
      default: return LogLevel.INFO;
    }
  }
  
  /**
   * Print current configuration information
   * @param isStdioMode Whether in stdio mode
   */
  public printConfig(isStdioMode: boolean = false): void {
    if (isStdioMode) return;
    
    Logger.info('Current Configuration:');
    
    Logger.info('Server Configuration:');
    Logger.info(`- Port: ${this.server.port} (Source: ${this.configSources['server.port']})`);

    Logger.info('Feishu Configuration:');
    if (this.feishu.appId) {
      Logger.info(`- App ID: ${this.maskApiKey(this.feishu.appId)} (Source: ${this.configSources['feishu.appId']})`);
    }
    if (this.feishu.appSecret) {
      Logger.info(`- App Secret: ${this.maskApiKey(this.feishu.appSecret)} (Source: ${this.configSources['feishu.appSecret']})`);
    }
    Logger.info(`- API URL: ${this.feishu.baseUrl} (Source: ${this.configSources['feishu.baseUrl']})`);
    Logger.info(`- Auth Type: ${this.feishu.authType} (Source: ${this.configSources['feishu.authType']})`);
    Logger.info(`- Token Endpoint: ${this.feishu.tokenEndpoint} (Source: ${this.configSources['feishu.tokenEndpoint']})`);
    
    Logger.info('Log Configuration:');
    Logger.info(`- Log Level: ${LogLevel[this.log.level]} (Source: ${this.configSources['log.level']})`);
    Logger.info(`- Show Timestamp: ${this.log.showTimestamp} (Source: ${this.configSources['log.showTimestamp']})`);
    Logger.info(`- Show Log Level: ${this.log.showLevel} (Source: ${this.configSources['log.showLevel']})`);
    
    Logger.info('Cache Configuration:');
    Logger.info(`- Cache Enabled: ${this.cache.enabled} (Source: ${this.configSources['cache.enabled']})`);
    Logger.info(`- Cache TTL: ${this.cache.ttl} seconds (Source: ${this.configSources['cache.ttl']})`);
    Logger.info(`- Max Cache Entries: ${this.cache.maxSize} (Source: ${this.configSources['cache.maxSize']})`);
  }
  
  /**
   * Mask API key
   * @param key API key
   * @returns Masked key string
   */
  private maskApiKey(key: string): string {
    if (!key || key.length <= 4) return '****';
    return `${key.substring(0, 2)}****${key.substring(key.length - 2)}`;
  }
  
  /**
   * Validate configuration completeness and validity
   * @returns Whether validation is successful
   */
  public validate(): boolean {
    // Validate server configuration
    if (!this.server.port || this.server.port <= 0) {
      Logger.error('Invalid server port configuration');
      return false;
    }
    
    // Validate Feishu configuration - allow demo values for testing
    if (!this.feishu.appId) {
      Logger.warn('Missing Feishu App ID, using demo value for testing');
      this.feishu.appId = 'demo_app_id';
      this.configSources['feishu.appId'] = ConfigSource.DEFAULT;
    }
    
    if (!this.feishu.appSecret) {
      Logger.warn('Missing Feishu App Secret, using demo value for testing');
      this.feishu.appSecret = 'demo_app_secret';
      this.configSources['feishu.appSecret'] = ConfigSource.DEFAULT;
    }

    if (!this.feishu.tokenEndpoint) {
      Logger.warn('Missing Feishu Token Endpoint, using default endpoint');
      this.feishu.tokenEndpoint = `http://127.0.0.1:${this.server.port}/getToken`;
      this.configSources['feishu.tokenEndpoint'] = ConfigSource.DEFAULT;
    }
    
    return true;
  }
} 