import { openDB, type IDBPDatabase } from 'idb';
import type { LostItemChatroomDetailMessage } from 'api/articles/entity';

const DB_NAME = 'koin-chat';
const DB_VERSION = 1;
const STORE_NAME = 'chatroom-messages';

/**
 * 채팅방 메시지 캐시(IndexedDB)
 *
 * - 방당 최대 50개: 메시지 1건 ≈ 1~2KB, 방당 ~100KB 이하
 *   (100개 방이 쌓여도 ~10MB로 브라우저 origin 할당량 대비 미미하다고 판단)
 * - TTL 3일: 분실물 채팅 특성상 오래된 메시지 재참조 빈도가 낮고,
 *   서버에서 전체 이력을 다시 받을 수 있으므로 캐시 목적에 충분.
 * - 모듈 로드 시 만료 캐시 정리(cleanupExpiredCache)로 누적 방지
 *
 * ref: https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria
 */

const MAX_MESSAGES_PER_ROOM = 50;
const CACHE_TTL_MS = 3 * 24 * 60 * 60 * 1000;

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

async function cleanupExpiredCache(): Promise<void> {
  try {
    const db = await getDB();
    const allRecords = await db.getAll(STORE_NAME);
    const now = Date.now();

    const tx = db.transaction(STORE_NAME, 'readwrite');
    const deletePromises = allRecords
      .filter((record) => now - record.updatedAt > CACHE_TTL_MS)
      .map((record) => tx.store.delete(record.key));

    await Promise.all([...deletePromises, tx.done]);
  } catch {
    console.error('Failed to cleanup expired cache');
  }
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
    const key = buildKey(articleId, chatroomId);
    const record = await db.get(STORE_NAME, key);

    if (!record) return null;

    if (Date.now() - record.updatedAt > CACHE_TTL_MS) {
      await db.delete(STORE_NAME, key);
      return null;
    }

    return record.messages;
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
    const trimmedMessages = messages.slice(-MAX_MESSAGES_PER_ROOM);

    await db.put(STORE_NAME, {
      key: buildKey(articleId, chatroomId),
      articleId,
      chatroomId,
      messages: trimmedMessages,
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

cleanupExpiredCache();
