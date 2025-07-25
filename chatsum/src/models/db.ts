import sqlite3 from "sqlite3";

const envConfig = [
  {
    "key": "CHAT_DB_PATH",
    "value": null,
    "required": true,
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

export function getDb(): sqlite3.Database {
  const dbName = getEnvValue("CHAT_DB_PATH");
  if (!dbName) {
    throw new Error("CHAT_DB_PATH is not set");
  }

  const db = new sqlite3.Database(dbName, (err) => {
    if (err) {
      console.error("chat db connect failed: ", dbName, err.message);
      return;
    }
  });

  return db;
}
