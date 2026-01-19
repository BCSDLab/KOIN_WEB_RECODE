/**
 * Chat SharedWorker
 *
 * @description
 * SharedWorker는 여러 브라우저 탭에서 공유되는 백그라운드 스크립트입니다.
 * 일반 Worker와 달리 모든 탭이 하나의 Worker 인스턴스를 공유합니다.
 *
 * @why SharedWorker를 사용하는가?
 * - WebSocket 연결을 탭마다 생성하면 서버 부하가 증가합니다.
 * - SharedWorker를 사용하면 모든 탭이 하나의 WebSocket 연결을 공유합니다.
 * - 탭 A에서 받은 메시지를 탭 B에서도 볼 수 있습니다.
 *
 * @architecture
 * ```
 * [Tab 1] ──┐                    ┌── [WebSocket Server]
 * [Tab 2] ──┼── [SharedWorker] ──┤
 * [Tab 3] ──┘                    └── [IndexedDB]
 * ```
 *
 * @role
 * 1. WebSocket 연결 관리 - 여러 탭 중 하나만 연결 유지
 * 2. IndexedDB 캐시 관리 - 메시지를 로컬에 저장하여 빠른 로딩
 * 3. 메시지 브로드캐스트 - 새 메시지를 모든 탭에 전달
 *
 * @communication Tab ↔ Worker 통신 방식
 * - Tab → Worker: port.postMessage({ type: 'CONNECT', payload: {...} })
 * - Worker → Tab: port.postMessage({ type: 'NEW_MESSAGE', payload: {...} })
 */

import {
  type ChatMessage,
  addMessage,
  getMessagesByChatroom,
  bulkAddMessages,
  clearChatroomMessages,
  mergeMessages,
  cleanupOldMessages,
} from 'utils/db/chatDB';
import { Client } from '@stomp/stompjs';
// IndexedDB 함수들을 chatDB.ts에서 import

// ============================================
// Types (메시지 타입 정의)
// ============================================

// 공통 Payload 타입
interface ChatroomPayload {
  articleId: number;
  chatroomId: number;
}

interface ChatMessageData {
  user_id: number;
  user_nickname: string;
  content: string;
  timestamp: string;
  is_image: boolean;
}

/**
 * Tab → Worker 명령 타입 (Discriminated Union)
 * @type CONNECT - WebSocket 연결 요청
 * @type DISCONNECT - WebSocket 연결 해제
 * @type SEND_MESSAGE - 채팅 메시지 전송
 * @type GET_MESSAGES - IndexedDB에서 캐시된 메시지 조회
 * @type SUBSCRIBE_CHATROOM - 특정 채팅방 구독 (실시간 메시지 수신)
 * @type UNSUBSCRIBE_CHATROOM - 채팅방 구독 해제
 * @type SYNC_MESSAGES - API 메시지를 IndexedDB에 전체 동기화 (덮어쓰기)
 * @type MERGE_MESSAGES - API 메시지를 IndexedDB에 병합 (새 메시지만 추가)
 * @type CLEAR_MESSAGES - 특정 채팅방의 캐시 삭제
 */
type WorkerCommand =
  | { type: 'CONNECT'; payload: { token: string; userId: number; wsUrl: string } }
  | { type: 'DISCONNECT' }
  | { type: 'SEND_MESSAGE'; payload: ChatroomPayload & { message: ChatMessageData } }
  | { type: 'GET_MESSAGES'; payload: ChatroomPayload }
  | { type: 'SUBSCRIBE_CHATROOM'; payload: ChatroomPayload }
  | { type: 'UNSUBSCRIBE_CHATROOM'; payload: ChatroomPayload }
  | { type: 'SYNC_MESSAGES'; payload: ChatroomPayload & { messages: ChatMessageData[] } }
  | { type: 'MERGE_MESSAGES'; payload: ChatroomPayload & { messages: ChatMessageData[] } }
  | { type: 'CLEAR_MESSAGES'; payload: ChatroomPayload };

/**
 * Worker → Tab 이벤트 타입 (Discriminated Union)
 * @type CONNECTED - WebSocket 연결 성공
 * @type DISCONNECTED - WebSocket 연결 해제
 * @type RECONNECTING - 재연결 시도 중
 * @type ERROR - 에러 발생
 * @type NEW_MESSAGE - 새 채팅 메시지 수신
 * @type MESSAGES - IndexedDB에서 조회한 메시지 목록
 * @type MESSAGES_MERGED - 메시지 병합 완료
 * @type SYNC_COMPLETE - 메시지 동기화 완료
 * @type CLEAR_COMPLETE - 메시지 삭제 완료
 * @type CHATROOM_LIST_UPDATED - 채팅방 목록 업데이트
 */
type WorkerEvent =
  | { type: 'CONNECTED'; payload?: { portsCount: number } }
  | { type: 'DISCONNECTED'; payload?: { portsCount: number } }
  | { type: 'RECONNECTING'; payload: { attempt: number; maxAttempts: number; delay: number } }
  | { type: 'ERROR'; payload: { message: string; code?: string } }
  | { type: 'NEW_MESSAGE'; payload: ChatroomPayload & { message: ChatMessageData } }
  | { type: 'MESSAGES'; payload: ChatroomPayload & { messages: ChatMessage[] } }
  | {
      type: 'MESSAGES_MERGED';
      payload: ChatroomPayload & { messages: ChatMessage[] | null; added: number; total: number };
    }
  | { type: 'SYNC_COMPLETE'; payload: ChatroomPayload }
  | { type: 'CLEAR_COMPLETE'; payload: ChatroomPayload }
  | { type: 'CHATROOM_LIST_UPDATED' };

// ============================================
// WebSocket & STOMP
// ============================================

// 재연결 설정
const RECONNECT_CONFIG = {
  maxAttempts: 3, // 최대 재연결 시도 횟수
  baseDelay: 1000, // 기본 딜레이 (1초)
  maxDelay: 30000, // 최대 딜레이 (30초)
} as const;

let reconnectAttempts = 0;
let reconnectTimeoutId: ReturnType<typeof setTimeout> | null = null;

const ports: MessagePort[] = [];

let stompClient: Client | null = null;
let stompConnected = false;

let connectionOwnerPort: MessagePort | null = null;

let currentToken: string | null = null;
let currentUserId: number | null = null;
let currentWsUrl: string | null = null;

const subscriptions: Map<string, Set<MessagePort>> = new Map();

const activeSubscriptions: Map<string, { unsubscribe: () => void }> = new Map();

const pendingSubscriptions: Set<string> = new Set();

let writeLock: Promise<void> = Promise.resolve();

function withWriteLock<T>(fn: () => Promise<T>): Promise<T> {
  const next = writeLock.then(fn, fn);
  writeLock = next.then(
    () => undefined,
    () => undefined,
  );
  return next;
}

// ============================================
// STOMP helpers
// ============================================
function getReconnectDelay(): number {
  const delay = Math.min(RECONNECT_CONFIG.baseDelay * 2 ** reconnectAttempts, RECONNECT_CONFIG.maxDelay);
  return delay;
}

function canReconnect(): boolean {
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  const hasCredentials = currentWsUrl !== null && currentToken !== null;
  const withinAttemptLimit = reconnectAttempts < RECONNECT_CONFIG.maxAttempts;
  const hasActivePorts = ports.length > 0;
  return isOnline && hasCredentials && withinAttemptLimit && hasActivePorts;
}

function attemptReconnect(): void {
  if (reconnectTimeoutId) {
    clearTimeout(reconnectTimeoutId);
    reconnectTimeoutId = null;
  }

  if (!canReconnect()) {
    if (reconnectAttempts >= RECONNECT_CONFIG.maxAttempts) {
      broadcast({
        type: 'ERROR',
        payload: {
          message: '채팅 서버 연결에 실패했습니다. 페이지를 새로고침해 주세요.',
          code: 'MAX_RECONNECT_ATTEMPTS',
        },
      });
    }
    return;
  }

  const delay = getReconnectDelay();
  reconnectAttempts += 1;

  broadcast({
    type: 'RECONNECTING',
    payload: {
      attempt: reconnectAttempts,
      maxAttempts: RECONNECT_CONFIG.maxAttempts,
      delay,
    },
  });

  reconnectTimeoutId = setTimeout(() => {
    if (currentToken && currentWsUrl) {
      connectStomp(currentToken, currentWsUrl);
    }
  }, delay);
}

function resetReconnectState(): void {
  reconnectAttempts = 0;
  if (reconnectTimeoutId) {
    clearTimeout(reconnectTimeoutId);
    reconnectTimeoutId = null;
  }
}

/** WebSocket 연결 및 STOMP 활성화 */
function connectStomp(token: string, wsUrl: string): void {
  if (stompClient?.connected) {
    return;
  }

  stompClient = new Client({
    brokerURL: wsUrl,
    connectHeaders: {
      Authorization: token,
    },
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    reconnectDelay: 0, // 자체 재연결 로직 사용

    onConnect: () => {
      stompConnected = true;
      resetReconnectState(); // 연결 성공 시 재연결 상태 초기화
      broadcast({ type: 'CONNECTED' });

      // 연결 전에 대기 중이던 구독 처리
      pendingSubscriptions.forEach((destination) => {
        stompSubscribe(destination);
      });
      pendingSubscriptions.clear();
    },

    onDisconnect: () => {
      stompConnected = false;
      activeSubscriptions.clear();
      broadcast({ type: 'DISCONNECTED' });

      // 재연결 시도
      attemptReconnect();
    },

    onStompError: () => {
      broadcast({ type: 'ERROR', payload: { message: '채팅 서버와 연결 중 오류가 발생했습니다.' } });
    },

    onWebSocketError: (event) => {
      console.error('[Worker] WebSocket error:', event);
      broadcast({
        type: 'ERROR',
        payload: {
          message: '채팅 연결에 문제가 발생했습니다.',
          code: 'WEBSOCKET_ERROR',
        },
      });
    },
  });

  stompClient.activate();
}

function disconnectStomp(): void {
  resetReconnectState();
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    stompConnected = false;
    activeSubscriptions.clear();
    pendingSubscriptions.clear();
  }
}

/** 특정 토픽(채팅방) 구독 */
function stompSubscribe(destination: string): void {
  // 연결 전이면 대기열에 추가
  if (!stompClient || !stompConnected) {
    pendingSubscriptions.add(destination);
    return;
  }

  if (activeSubscriptions.has(destination)) {
    return;
  }

  const subscription = stompClient.subscribe(destination, (message) => {
    try {
      const body = JSON.parse(message.body);
      handleIncomingMessage(destination, body);
    } catch {
      broadcast({
        type: 'ERROR',
        payload: {
          message: '메시지를 처리하는 중 오류가 발생했습니다.',
          code: 'MESSAGE_PARSE_ERROR',
        },
      });
    }
  });

  activeSubscriptions.set(destination, subscription);
}

/** 특정 토픽 구독 해제 */
function stompUnsubscribe(destination: string): void {
  pendingSubscriptions.delete(destination);

  const sub = activeSubscriptions.get(destination);
  if (sub) {
    sub.unsubscribe();
    activeSubscriptions.delete(destination);
  }
}

/** 메시지 전송 (STOMP publish) */
function stompSend(destination: string, body: string): void {
  if (!stompClient || !stompConnected) {
    return;
  }

  stompClient.publish({
    destination,
    body,
    headers: { 'content-type': 'application/json' },
  });
}

/**
 * 서버에서 수신한 메시지 처리
 * - IndexedDB에 저장 (chatDB.ts 사용)
 * - 해당 채팅방을 구독 중인 탭에 전달
 */
async function handleIncomingMessage(destination: string, message: ChatMessageData): Promise<void> {
  const chatMatch = destination.match(/\/topic\/chat\/(\d+)\/(\d+)/);

  if (chatMatch) {
    const articleId = parseInt(chatMatch[1], 10);
    const chatroomId = parseInt(chatMatch[2], 10);
    const key = `${articleId}:${chatroomId}`;

    await withWriteLock(async () => {
      await addMessage({
        articleId,
        chatroomId,
        userId: message.user_id,
        userNickname: message.user_nickname,
        content: message.content,
        timestamp: message.timestamp,
        isImage: message.is_image,
        isSynced: 1,
      });
    });

    // 해당 채팅방을 구독 중인 탭에만 전달
    const subscribedPorts = subscriptions.get(key);
    if (subscribedPorts) {
      subscribedPorts.forEach((port) => {
        port.postMessage({
          type: 'NEW_MESSAGE',
          payload: { articleId, chatroomId, message },
        });
      });
    }
  }

  const listMatch = destination.match(/\/topic\/chatroom\/list\/(\d+)/);
  if (listMatch) {
    broadcast({ type: 'CHATROOM_LIST_UPDATED' });
  }
}

/** 모든 탭에 메시지 전송 */
function broadcast(message: WorkerEvent): void {
  ports.forEach((port) => port.postMessage(message));
}

// ============================================
// Port lifecycle
// ============================================

function removePort(port: MessagePort): void {
  const index = ports.indexOf(port);
  if (index !== -1) {
    ports.splice(index, 1);
  }

  subscriptions.forEach((portSet) => portSet.delete(port));

  if (port === connectionOwnerPort) {
    const otherPorts = ports.filter((p) => p !== port);
    if (otherPorts.length > 0 && currentToken && currentWsUrl) {
      connectionOwnerPort = otherPorts[0];
    } else {
      disconnectStomp();
      connectionOwnerPort = null;
    }
  }
}

// ============================================
// Tab → Worker 메시지 핸들러
// ============================================

async function handleMessage(port: MessagePort, data: WorkerCommand): Promise<void> {
  switch (data.type) {
    case 'CONNECT': {
      const { token, userId, wsUrl } = data.payload;

      const shouldReconnect = (currentToken && currentToken !== token) || (currentWsUrl && currentWsUrl !== wsUrl);

      currentToken = token;
      currentUserId = userId;
      currentWsUrl = wsUrl;

      if (shouldReconnect) {
        disconnectStomp();
      }

      if (!connectionOwnerPort || !ports.includes(connectionOwnerPort)) {
        connectionOwnerPort = port;
        connectStomp(token, wsUrl);
      } else {
        if (!stompClient?.connected) {
          connectStomp(token, wsUrl);
        }
      }
      break;
    }

    case 'DISCONNECT': {
      removePort(port);

      if (ports.length === 0) {
        disconnectStomp();
        connectionOwnerPort = null;
      }
      break;
    }

    case 'SEND_MESSAGE': {
      const { articleId, chatroomId, message } = data.payload;
      stompSend(`/app/chat/${articleId}/${chatroomId}`, JSON.stringify(message));
      break;
    }

    case 'SUBSCRIBE_CHATROOM': {
      const { articleId, chatroomId } = data.payload;
      const key = `${articleId}:${chatroomId}`;
      const dest = `/topic/chat/${articleId}/${chatroomId}`;

      if (!subscriptions.has(key)) {
        subscriptions.set(key, new Set());
        stompSubscribe(dest);
      }
      subscriptions.get(key)!.add(port);

      // 채팅방 목록 업데이트도 구독
      if (currentUserId) {
        stompSubscribe(`/topic/chatroom/list/${currentUserId}`);
      }
      break;
    }

    case 'UNSUBSCRIBE_CHATROOM': {
      const { articleId, chatroomId } = data.payload;
      const key = `${articleId}:${chatroomId}`;
      const dest = `/topic/chat/${articleId}/${chatroomId}`;

      const subs = subscriptions.get(key);
      if (subs) {
        subs.delete(port);

        if (subs.size === 0) {
          subscriptions.delete(key);
          stompUnsubscribe(dest);
        }
      }
      break;
    }

    case 'GET_MESSAGES': {
      const { articleId, chatroomId } = data.payload;
      const messages = await getMessagesByChatroom(articleId, chatroomId);
      port.postMessage({
        type: 'MESSAGES',
        payload: { articleId, chatroomId, messages },
      });
      break;
    }

    case 'SYNC_MESSAGES': {
      const { articleId, chatroomId, messages } = data.payload;

      const chatMessages: Omit<ChatMessage, 'id'>[] = messages.map((msg) => ({
        articleId,
        chatroomId,
        userId: msg.user_id,
        userNickname: msg.user_nickname,
        content: msg.content,
        timestamp: msg.timestamp,
        isImage: msg.is_image,
        isSynced: 1,
      }));

      await withWriteLock(async () => {
        await clearChatroomMessages(articleId, chatroomId);
        await bulkAddMessages(chatMessages);
      });

      port.postMessage({
        type: 'SYNC_COMPLETE',
        payload: { articleId, chatroomId },
      });
      break;
    }

    case 'MERGE_MESSAGES': {
      const { articleId, chatroomId, messages } = data.payload;

      const chatMessages: Omit<ChatMessage, 'id'>[] = messages.map((msg) => ({
        articleId,
        chatroomId,
        userId: msg.user_id,
        userNickname: msg.user_nickname,
        content: msg.content,
        timestamp: msg.timestamp,
        isImage: msg.is_image,
        isSynced: 1,
      }));

      const result = await withWriteLock(async () => mergeMessages(articleId, chatroomId, chatMessages));
      const { added, total } = result;

      if (added > 0) {
        const allMessages = await getMessagesByChatroom(articleId, chatroomId);
        port.postMessage({
          type: 'MESSAGES_MERGED',
          payload: { articleId, chatroomId, messages: allMessages, added, total },
        });
      } else {
        port.postMessage({
          type: 'MESSAGES_MERGED',
          payload: { articleId, chatroomId, messages: null, added: 0, total },
        });
      }
      break;
    }

    case 'CLEAR_MESSAGES': {
      const { articleId, chatroomId } = data.payload;

      await withWriteLock(async () => {
        await clearChatroomMessages(articleId, chatroomId);
      });

      port.postMessage({
        type: 'CLEAR_COMPLETE',
        payload: { articleId, chatroomId },
      });
      break;
    }

    default:
      break;
  }
}

// ============================================
// SharedWorker 진입점
// ============================================

self.onconnect = (event: MessageEvent) => {
  const port = event.ports[0];
  ports.push(port);

  port.onmessage = (e: MessageEvent) => handleMessage(port, e.data);
  port.onmessageerror = () => removePort(port);

  // 현재 연결 상태 알림
  port.postMessage({
    type: stompConnected ? 'CONNECTED' : 'DISCONNECTED',
    payload: { portsCount: ports.length },
  });

  port.start();

  if (ports.length === 1) {
    withWriteLock(async () => {
      await cleanupOldMessages();
    });
  }
};
