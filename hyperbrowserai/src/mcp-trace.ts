// Mock implementation of mcp-trace for development
export class ConsoleAdapter {
  log(message: any) {
    console.log('[ConsoleAdapter]', message);
  }
}

export class ContexaTraceAdapter {
  log(message: any) {
    console.log('[ContexaTraceAdapter]', message);
  }
}

export class MultiAdapter {
  private adapters: any[];

  constructor(...adapters: any[]) {
    this.adapters = adapters;
  }

  log(message: any) {
    this.adapters.forEach(adapter => {
      if (adapter.log) {
        adapter.log(message);
      }
    });
  }
}

export class TraceMiddleware {
  private adapter: any;

  constructor(options: { adapter: any }) {
    this.adapter = options.adapter;
  }

  express() {
    return (req: any, res: any, next: any) => {
      this.adapter.log({
        method: req.method,
        url: req.url,
        timestamp: new Date().toISOString()
      });
      next();
    };
  }
}
