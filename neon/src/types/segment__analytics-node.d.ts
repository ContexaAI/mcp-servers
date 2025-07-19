declare module '@segment/analytics-node' {
  export interface AnalyticsSettings {
    writeKey: string;
    host?: string;
    flushAt?: number;
    flushInterval?: number;
    maxEventsInBatch?: number;
    maxRetries?: number;
    retryDelayOptions?: {
      base?: number;
      multiplier?: number;
      maxDelay?: number;
    };
    disable?: boolean;
    httpRequestTimeout?: number;
  }

  export interface TrackParams {
    userId?: string;
    anonymousId?: string;
    event: string;
    properties?: Record<string, any>;
    context?: Record<string, any>;
    timestamp?: Date;
    integrations?: Record<string, any>;
  }

  export interface IdentifyParams {
    userId?: string;
    anonymousId?: string;
    traits?: Record<string, any>;
    context?: Record<string, any>;
    timestamp?: Date;
    integrations?: Record<string, any>;
  }

  export class Analytics {
    constructor(settings: AnalyticsSettings);
    
    track(params: TrackParams): Promise<void>;
    identify(params: IdentifyParams): Promise<void>;
    flush(): Promise<void>;
    closeAndFlush(): Promise<void>;
  }
}
