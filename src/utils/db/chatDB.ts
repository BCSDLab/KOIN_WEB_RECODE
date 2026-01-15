/**
 * chatDB - IndexedDB 채팅 데이터 관리 모듈
 *
 * @description
 * IndexedDB를 사용하여 채팅 메시지를 로컬에 캐시합니다.
 * SharedWorker와 메인 스레드 모두에서 사용할 수 있습니다.
 *
 * @why IndexedDB를 사용하는가?
 * - 채팅 메시지를 로컬에 캐시하여 페이지 재진입 시 빠르게 표시
 * - 오프라인 상태에서도 이전 메시지 확인 가능
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface ChatMessage {
  id?: number;
  chatroomId: number;
  articleId: number;
  userId: number;
  userNickname: string;
  content: string;
  timestamp: string;
  isImage: boolean;
  isSynced: 0 | 1;
}

export interface Chatroom {
  id: number;
  articleId: number;
  articleTitle: string;
  lastMessageAt: string;
  recentMessageContent: string;
  lostItemImageUrl: string;
  unreadMessageCount: number;
}

interface ChatDBSchema extends DBSchema {
  messages: {
    key: number;
    value: ChatMessage;
    indexes: {
      'by-chatroom': [number, number];
      'by-timestamp': string;
      'by-synced': 0 | 1;
      'by-chatroom-timestamp': [number, number, string];
    };
  };
  chatrooms: {
    key: number;
    value: Chatroom;
    indexes: {
      'by-lastMessage': string;
    };
  };
}

const DB_NAME = 'koin-chat-db';
const DB_VERSION = 1;

export const CLEANUP_MAX_AGE_DAYS = 3;
export const CLEANUP_MAX_MESSAGES_PER_CHATROOM = 50;

// ============================================
// Database Connection
// ============================================

let dbInstance: IDBPDatabase<ChatDBSchema> | null = null;

export async function getChatDB(): Promise<IDBPDatabase<ChatDBSchema>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<ChatDBSchema>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // messages store
      if (!db.objectStoreNames.contains('messages')) {
        const messageStore = db.createObjectStore('messages', {
          keyPath: 'id',
          autoIncrement: true,
        });
        messageStore.createIndex('by-chatroom', ['articleId', 'chatroomId']);
        messageStore.createIndex('by-timestamp', 'timestamp');
        messageStore.createIndex('by-synced', 'isSynced');
        messageStore.createIndex('by-chatroom-timestamp', ['articleId', 'chatroomId', 'timestamp']);
      }

      // chatrooms store (현재 미사용, 향후 확장용)
      if (!db.objectStoreNames.contains('chatrooms')) {
        const chatroomStore = db.createObjectStore('chatrooms', {
          keyPath: 'id',
        });
        chatroomStore.createIndex('by-lastMessage', 'lastMessageAt');
      }
    },
  });

  return dbInstance;
}

// ============================================
// Message Operations (기본)
// ============================================

export async function addMessage(message: Omit<ChatMessage, 'id'>): Promise<number> {
  const db = await getChatDB();
  return db.add('messages', message as ChatMessage);
}

export async function getMessagesByChatroom(articleId: number, chatroomId: number): Promise<ChatMessage[]> {
  const db = await getChatDB();
  return db.getAllFromIndex('messages', 'by-chatroom', [articleId, chatroomId]);
}

/** 동기화되지 않은 메시지 조회 (오프라인 전송 대기용, 현재 미사용) */
export async function getUnsyncedMessages(): Promise<ChatMessage[]> {
  const db = await getChatDB();
  return db.getAllFromIndex('messages', 'by-synced', 0);
}

/** 메시지를 동기화 완료로 표시 (현재 미사용) */
export async function markMessageAsSynced(id: number): Promise<void> {
  const db = await getChatDB();
  const message = await db.get('messages', id);
  if (message) {
    message.isSynced = 1;
    await db.put('messages', message);
  }
}

/** 여러 메시지 한번에 저장 */
export async function bulkAddMessages(messages: Omit<ChatMessage, 'id'>[]): Promise<void> {
  const db = await getChatDB();
  const tx = db.transaction('messages', 'readwrite');
  await Promise.all([...messages.map((msg) => tx.store.add(msg as ChatMessage)), tx.done]);
}

/** 특정 채팅방의 모든 메시지 삭제 */
export async function clearChatroomMessages(articleId: number, chatroomId: number): Promise<void> {
  const db = await getChatDB();
  const messages = await getMessagesByChatroom(articleId, chatroomId);
  const tx = db.transaction('messages', 'readwrite');
  await Promise.all([...messages.map((msg) => tx.store.delete(msg.id!)), tx.done]);
}

// ============================================
// Message Operations
// ============================================

/**
 * API 메시지를 IndexedDB에 병합합니다.
 *
 * @description
 * - 중복 메시지: timestamp + userId + content 조합으로 판별하여 제외
 * - 오래된 메시지: CLEANUP_MAX_AGE_DAYS 이전 메시지는 저장하지 않음
 */
export async function mergeMessages(
  articleId: number,
  chatroomId: number,
  newMessages: Omit<ChatMessage, 'id'>[],
): Promise<{ added: number; total: number }> {
  const db = await getChatDB();
  const existingMessages = await getMessagesByChatroom(articleId, chatroomId);

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - CLEANUP_MAX_AGE_DAYS);
  const cutoffTimestamp = cutoffDate.toISOString();

  const existingKeys = new Set(existingMessages.map((msg) => `${msg.timestamp}:${msg.userId}:${msg.content}`));

  const messagesToAdd = newMessages.filter(
    (msg) => msg.timestamp >= cutoffTimestamp && !existingKeys.has(`${msg.timestamp}:${msg.userId}:${msg.content}`),
  );

  if (messagesToAdd.length > 0) {
    const tx = db.transaction('messages', 'readwrite');
    await Promise.all([...messagesToAdd.map((msg) => tx.store.add(msg as ChatMessage)), tx.done]);
  }

  return {
    added: messagesToAdd.length,
    total: existingMessages.length + messagesToAdd.length,
  };
}

// ============================================
// Cleanup (캐시 자동 정리)
// ============================================

/**
 * 오래된 메시지를 자동 삭제합니다.
 *
 * @policy
 * 1. 3일 지난 메시지는 삭제
 * 2. 채팅방당 최대 50개 메시지만 유지
 */
export async function cleanupOldMessages(): Promise<void> {
  try {
    const db = await getChatDB();

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - CLEANUP_MAX_AGE_DAYS);
    const cutoffTimestamp = cutoffDate.toISOString();
    {
      const tx = db.transaction('messages', 'readwrite');
      const index = tx.store.index('by-timestamp');
      const range = IDBKeyRange.upperBound(cutoffTimestamp, true);

      let cursor = await index.openCursor(range);
      while (cursor) {
        await cursor.delete();
        cursor = await cursor.continue();
      }

      await tx.done;
    }

    {
      const tx = db.transaction('messages', 'readwrite');
      const index = tx.store.index('by-chatroom-timestamp');

      let cursor = await index.openCursor();
      let currentKey = '';
      let count = 0;

      while (cursor) {
        const msg = cursor.value;
        const key = `${msg.articleId}:${msg.chatroomId}`;

        if (key !== currentKey) {
          currentKey = key;
          count = 0;
        }

        count++;

        if (count > CLEANUP_MAX_MESSAGES_PER_CHATROOM) {
          await cursor.delete();
        }

        cursor = await cursor.continue();
      }

      await tx.done;
    }
  } catch (error) {
    console.error('[chatDB] Cleanup error:', error);
  }
}

// ============================================
// Chatroom Operations (현재 미사용)
// ============================================

export async function upsertChatroom(chatroom: Chatroom): Promise<void> {
  const db = await getChatDB();
  await db.put('chatrooms', chatroom);
}

export async function getChatrooms(): Promise<Chatroom[]> {
  const db = await getChatDB();
  const chatrooms = await db.getAllFromIndex('chatrooms', 'by-lastMessage');
  return chatrooms.reverse();
}

export async function getChatroom(chatroomId: number): Promise<Chatroom | undefined> {
  const db = await getChatDB();
  return db.get('chatrooms', chatroomId);
}

export async function deleteChatroom(chatroomId: number): Promise<void> {
  const db = await getChatDB();
  await db.delete('chatrooms', chatroomId);
}
