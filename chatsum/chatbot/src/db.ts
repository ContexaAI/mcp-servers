import { ChatMessage } from "./types";

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

export async function saveChatMessage(msg: ChatMessage) {
  try {
    const db = await getDb();
    if (!db) {
      console.warn("⚠️  Database not available. Message not saved.");
      return;
    }

    const {
      msg_type,
      msg_id,
      created_at,
      room_id,
      room_name,
      room_avatar,
      talker_id,
      talker_name,
      talker_avatar,
      content,
      url_title,
      url_desc,
      url_link,
      url_thumb,
    } = msg;

    let sql = `INSERT INTO chat_messages(
      created_at,
      msg_id,
      room_id,
      room_name,
      room_avatar,
      talker_id,
      talker_name,
      talker_avatar,
      content,
      msg_type,
      url_title,
      url_desc,
      url_link,
      url_thumb
    ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    db.run(sql, [
      created_at,
      msg_id,
      room_id,
      room_name,
      room_avatar,
      talker_id,
      talker_name,
      talker_avatar,
      content,
      msg_type,
      url_title,
      url_desc,
      url_link,
      url_thumb,
    ]);

    console.error("save message ok");
  } catch (error) {
    console.error("save message failed: ", error);
    // Don't throw error, just log it
  }
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
