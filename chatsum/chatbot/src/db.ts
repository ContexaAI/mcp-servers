import { ChatMessage } from "./types";
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

export async function saveChatMessage(msg: ChatMessage) {
  try {
    const db = getDb();
    if (!db) {
      throw new Error("db is not connected");
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
    throw error;
  }
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
