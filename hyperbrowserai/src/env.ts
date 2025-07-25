import * as fs from 'fs';
import * as path from 'path';

interface EnvVariable {
  key: string;
  value: string | null;
  required: boolean;
  label: string;
}

class EnvManager {
  private envVars: Map<string, string> = new Map();
  private loaded = false;

  constructor() {
    this.loadEnv();
  }

  private loadEnv(): void {
    if (this.loaded) return;

    const envPath = path.join(process.cwd(), '.env');
    
    try {
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const envVariables: EnvVariable[] = JSON.parse(envContent);
        
        for (const envVar of envVariables) {
          // Use the value from .env if set, otherwise use process.env, otherwise use the default value
          const value = envVar.value !== null ? envVar.value : (process.env[envVar.key] || '');
          
          if (envVar.required && !value) {
            throw new Error(`Required environment variable ${envVar.key} is not set`);
          }
          
          this.envVars.set(envVar.key, value);
          // Also set it in process.env for compatibility
          process.env[envVar.key] = value;
        }
      }
    } catch (error) {
      console.warn('Failed to load .env file:', error);
    }
    
    this.loaded = true;
  }

  public get(key: string, defaultValue?: string): string | undefined {
    this.loadEnv();
    return this.envVars.get(key) || defaultValue;
  }

  public getRequired(key: string): string {
    const value = this.get(key);
    if (!value) {
      throw new Error(`Required environment variable ${key} is not set`);
    }
    return value;
  }

  public getAll(): Record<string, string> {
    this.loadEnv();
    return Object.fromEntries(this.envVars);
  }
}

export const env = new EnvManager();
