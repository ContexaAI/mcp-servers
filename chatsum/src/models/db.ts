const envConfig = [
  {
    "key": "CHAT_DB_PATH",
    "value": null,
    "required": false,
    "label": "CHAT_DB_PATH"
  }
];

function getEnvValue(key: string): string {
  const config = envConfig.find(item => item.key === key);
  if (!config) {
    throw new Error(`Environment variable ${key} not configured`);
  }
  
  const value = process.env[key] || config.value;
  if (config.required && !value) {
    throw new Error(`${config.label} is not set`);
  }
  
  return value || "";
}

export async function getDb(): Promise<any> {
  const dbName = getEnvValue("CHAT_DB_PATH");
  if (!dbName) {
    console.warn("⚠️  CHAT_DB_PATH is not set. Database functionality will be disabled.");
    return null;
  }

  try {
    const sqlite3 = await import("sqlite3");
    const db = new sqlite3.Database(dbName, (err: any) => {
      if (err) {
        console.warn("⚠️  Failed to connect to database:", dbName, err.message);
        console.warn("⚠️  Database functionality will be disabled.");
        return;
      }
    });

    return db;
  } catch (error) {
    console.warn("⚠️  Failed to initialize database:", error);
    console.warn("⚠️  Database functionality will be disabled.");
    return null;
  }
}
