import { openDB, type IDBPDatabase } from 'idb';
import type { LostItemChatroomDetailMessage } from 'api/articles/entity';

const DB_NAME = 'koin-chat';
const DB_VERSION = 1;
const STORE_NAME = 'chatroom-messages';

interface CachedChatroom {
  key: string;
  articleId: number;
  chatroomId: number;
  messages: LostItemChatroomDetailMessage[];
  updatedAt: number;
}

type ChatDB = IDBPDatabase<{
  [STORE_NAME]: {
    key: string;
    value: CachedChatroom;
  };
}>;

let dbPromise: Promise<ChatDB> | null = null;

function getDB(): Promise<ChatDB> {
  if (!dbPromise) {
    dbPromise = openDB<{
      [STORE_NAME]: {
        key: string;
        value: CachedChatroom;
      };
    }>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        }
      },
    });
  }
  return dbPromise;
}

function buildKey(articleId: number, chatroomId: number): string {
  return `${articleId}:${chatroomId}`;
}

export async function getCachedMessages(
  articleId: number,
  chatroomId: number,
): Promise<LostItemChatroomDetailMessage[] | null> {
  try {
    const db = await getDB();
    const record = await db.get(STORE_NAME, buildKey(articleId, chatroomId));
    return record?.messages ?? null;
  } catch {
    console.error('Failed to get cached messages');
    return null;
  }
}

export async function cacheMessages(
  articleId: number,
  chatroomId: number,
  messages: LostItemChatroomDetailMessage[],
): Promise<void | null> {
  try {
    const db = await getDB();
    await db.put(STORE_NAME, {
      key: buildKey(articleId, chatroomId),
      articleId,
      chatroomId,
      messages,
      updatedAt: Date.now(),
    });
  } catch {
    console.error('Failed to cache messages');
    return null;
  }
}

export async function clearChatroomCache(articleId: number, chatroomId: number): Promise<void | null> {
  try {
    const db = await getDB();
    await db.delete(STORE_NAME, buildKey(articleId, chatroomId));
  } catch {
    console.error('Failed to clear chatroom cache');
    return null;
  }
}

export async function clearAllChatCache(): Promise<void | null> {
  try {
    const db = await getDB();
    await db.clear(STORE_NAME);
  } catch {
    console.error('Failed to clear all chat cache');
    return null;
  }
}
