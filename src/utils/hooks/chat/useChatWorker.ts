import { useCallback, useEffect, useRef, useState } from 'react';
import type { LostItemChatroomDetailMessage } from 'api/articles/entity';

interface WorkerMessage {
  type: string;
  payload?: unknown;
}

interface NewMessagePayload {
  articleId: number;
  chatroomId: number;
  message: LostItemChatroomDetailMessage;
}

interface MessagesPayload {
  articleId: number;
  chatroomId: number;
  messages: Array<{
    userId: number;
    userNickname: string;
    content: string;
    timestamp: string;
    isImage: boolean;
  }>;
}

interface UseChatWorkerOptions {
  token: string;
  userId: number;
  articleId: number | null;
  chatroomId: number | null;
  onChatroomListUpdated?: () => void;
}

interface UseChatWorkerReturn {
  isConnected: boolean;
  realtimeMessages: LostItemChatroomDetailMessage[];
  sendMessage: (message: {
    user_nickname: string;
    user_id: number;
    content: string;
    timestamp: string;
    is_image: boolean;
  }) => void;
  syncMessages: (messages: LostItemChatroomDetailMessage[]) => void;
  mergeMessages: (messages: LostItemChatroomDetailMessage[]) => void;
  setMessagesFromAPI: (messages: LostItemChatroomDetailMessage[]) => void;
  clearRealtimeMessages: () => void;
}

// ============================================
// SharedWorker 싱글톤
// ============================================

let sharedWorker: SharedWorker | null = null;

function getSharedWorker(): SharedWorker | null {
  if (typeof window === 'undefined') return null;

  if (!('SharedWorker' in window)) {
    console.warn('[useChatWorker] SharedWorker is not supported in this browser');
    return null;
  }

  if (!sharedWorker) {
    try {
      sharedWorker = new SharedWorker(new URL('../../worker/chat.shared-worker.ts', import.meta.url), {
        type: 'module',
        name: 'koin-chat-worker',
      });

      sharedWorker.onerror = (e) => {
        console.error('[useChatWorker] SharedWorker error:', e);
      };
    } catch (error) {
      console.error('[useChatWorker] Failed to create SharedWorker:', error);
      return null;
    }
  }

  return sharedWorker;
}

export default function useChatWorker({
  token,
  userId,
  articleId,
  chatroomId,
  onChatroomListUpdated,
}: UseChatWorkerOptions): UseChatWorkerReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [realtimeMessages, setRealtimeMessages] = useState<LostItemChatroomDetailMessage[]>([]);

  const portRef = useRef<MessagePort | null>(null);

  const onChatroomListUpdatedRef = useRef(onChatroomListUpdated);
  useEffect(() => {
    onChatroomListUpdatedRef.current = onChatroomListUpdated;
  }, [onChatroomListUpdated]);

  const currentRoomRef = useRef({ articleId, chatroomId });
  useEffect(() => {
    currentRoomRef.current = { articleId, chatroomId };
  }, [articleId, chatroomId]);

  useEffect(() => {
    const worker = getSharedWorker();
    if (!worker || !userId) return undefined;

    const port = worker.port;
    portRef.current = port;

    const handleMessage = (event: MessageEvent<WorkerMessage>) => {
      const { type, payload } = event.data;

      switch (type) {
        case 'CONNECTED':
          setIsConnected(true);
          break;

        case 'DISCONNECTED':
          setIsConnected(false);
          break;

        case 'NEW_MESSAGE': {
          const { articleId: msgArticleId, chatroomId: msgChatroomId, message } = payload as NewMessagePayload;

          const { articleId: currentArticleId, chatroomId: currentChatroomId } = currentRoomRef.current;
          if (msgArticleId === currentArticleId && msgChatroomId === currentChatroomId) {
            setRealtimeMessages((prev) => [...prev, message]);
          }
          break;
        }

        case 'MESSAGES': {
          const { messages } = payload as MessagesPayload;

          const formattedMessages = messages.map((msg) => ({
            user_id: msg.userId,
            user_nickname: msg.userNickname,
            content: msg.content,
            timestamp: msg.timestamp,
            is_image: msg.isImage,
          }));

          setRealtimeMessages(formattedMessages);
          break;
        }

        case 'MESSAGES_MERGED':
          break;

        case 'CHATROOM_LIST_UPDATED':
          onChatroomListUpdatedRef.current?.();
          break;

        case 'ERROR':
          console.error('Chat worker error:', payload);
          break;

        default:
          break;
      }
    };

    port.addEventListener('message', handleMessage);
    port.start();

    const wsUrl = `${process.env.NEXT_PUBLIC_API_PATH?.replace('https', 'wss').replace('http', 'ws')}/ws-stomp`;

    port.postMessage({
      type: 'CONNECT',
      payload: { token, userId, wsUrl },
    });

    const onPageHide = () => {
      try {
        port.postMessage({ type: 'DISCONNECT' });
      } catch {}
    };
    window.addEventListener('pagehide', onPageHide);

    return () => {
      port.removeEventListener('message', handleMessage);
      window.removeEventListener('pagehide', onPageHide);
    };
  }, [token, userId]);

  // ========== Effect: 채팅방 구독 ==========
  useEffect(() => {
    const port = portRef.current;
    if (!port || articleId == null || chatroomId == null) return undefined;

    port.postMessage({
      type: 'SUBSCRIBE_CHATROOM',
      payload: { articleId, chatroomId },
    });

    port.postMessage({
      type: 'GET_MESSAGES',
      payload: { articleId, chatroomId },
    });

    return () => {
      port.postMessage({
        type: 'UNSUBSCRIBE_CHATROOM',
        payload: { articleId, chatroomId },
      });
      setRealtimeMessages([]);
    };
  }, [articleId, chatroomId]);

  const sendMessage = useCallback(
    (message: { user_nickname: string; user_id: number; content: string; timestamp: string; is_image: boolean }) => {
      const port = portRef.current;
      if (!port || articleId == null || chatroomId == null) return;

      port.postMessage({
        type: 'SEND_MESSAGE',
        payload: { articleId, chatroomId, message },
      });
    },
    [articleId, chatroomId],
  );

  const syncMessages = useCallback(
    (messages: LostItemChatroomDetailMessage[]) => {
      const port = portRef.current;
      if (!port || articleId == null || chatroomId == null) return;

      port.postMessage({
        type: 'SYNC_MESSAGES',
        payload: { articleId, chatroomId, messages },
      });
    },
    [articleId, chatroomId],
  );

  const mergeMessages = useCallback(
    (messages: LostItemChatroomDetailMessage[]) => {
      const port = portRef.current;
      if (!port || articleId == null || chatroomId == null) return;

      port.postMessage({
        type: 'MERGE_MESSAGES',
        payload: { articleId, chatroomId, messages },
      });
    },
    [articleId, chatroomId],
  );

  const setMessagesFromAPI = useCallback((messages: LostItemChatroomDetailMessage[]) => {
    setRealtimeMessages(messages);
  }, []);

  const clearRealtimeMessages = useCallback(() => {
    setRealtimeMessages([]);
  }, []);

  return {
    isConnected,
    realtimeMessages,
    sendMessage,
    syncMessages,
    mergeMessages,
    setMessagesFromAPI,
    clearRealtimeMessages,
  };
}
