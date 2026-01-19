import { useCallback, useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import showToast from 'utils/ts/showToast';
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

function isSharedWorkerSupported(): boolean {
  return typeof window !== 'undefined' && 'SharedWorker' in window;
}

// ============================================
// SharedWorker 싱글톤
// ============================================

let sharedWorker: SharedWorker | null = null;

function getSharedWorker(): SharedWorker | null {
  if (!isSharedWorkerSupported()) {
    return null;
  }

  if (!sharedWorker) {
    try {
      sharedWorker = new SharedWorker(new URL('../../worker/chat.shared-worker.ts', import.meta.url), {
        type: 'module',
        name: 'koin-chat-worker',
      });

      sharedWorker.onerror = () => {
        showToast('error', '채팅 연결에 문제가 발생했습니다.');
      };
    } catch {
      showToast('error', '채팅 서비스를 시작할 수 없습니다.');
      return null;
    }
  }

  return sharedWorker;
}

function getWebSocketUrl(): string {
  return `${process.env.NEXT_PUBLIC_API_PATH?.replace('https', 'wss').replace('http', 'ws')}/ws-stomp`;
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

  const stompClientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
  const listSubscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);

  const onChatroomListUpdatedRef = useRef(onChatroomListUpdated);
  useEffect(() => {
    onChatroomListUpdatedRef.current = onChatroomListUpdated;
  }, [onChatroomListUpdated]);

  const currentRoomRef = useRef({ articleId, chatroomId });
  useEffect(() => {
    currentRoomRef.current = { articleId, chatroomId };
  }, [articleId, chatroomId]);

  useEffect(() => {
    if (!isSharedWorkerSupported()) return undefined;

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

        case 'ERROR': {
          const errorPayload = payload as { message?: string; code?: string } | undefined;
          if (errorPayload?.code === 'MAX_RECONNECT_ATTEMPTS') {
            showToast('error', '채팅 서버 연결에 실패했습니다. 페이지를 새로고침해 주세요.');
          } else {
            showToast('error', errorPayload?.message || '채팅 중 오류가 발생했습니다.');
          }
          break;
        }

        default:
          break;
      }
    };

    port.addEventListener('message', handleMessage);
    port.start();

    const wsUrl = getWebSocketUrl();

    port.postMessage({
      type: 'CONNECT',
      payload: { token, userId, wsUrl },
    });

    const onPageHide = () => {
      try {
        port.postMessage({ type: 'DISCONNECT' });
      } catch {
        // ignore
      }
    };
    window.addEventListener('pagehide', onPageHide);

    return () => {
      port.removeEventListener('message', handleMessage);
      window.removeEventListener('pagehide', onPageHide);
    };
  }, [token, userId]);

  // ============================================
  // 폴백 : 직접 STOMP 연결 (모바일 브라우저 SharedWorker 미지원 시)
  // ============================================
  useEffect(() => {
    if (isSharedWorkerSupported()) return undefined;
    if (!userId || !token) return undefined;

    const wsUrl = getWebSocketUrl();

    const client = new Client({
      brokerURL: wsUrl,
      connectHeaders: {
        Authorization: token,
      },
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      reconnectDelay: 5000,

      onConnect: () => {
        setIsConnected(true);

        // 채팅방 목록 업데이트 구독
        if (userId) {
          listSubscriptionRef.current = client.subscribe(`/topic/chatroom/list/${userId}`, () => {
            onChatroomListUpdatedRef.current?.();
          });
        }
      },

      onDisconnect: () => {
        setIsConnected(false);
      },

      onStompError: () => {
        showToast('error', '채팅 서버 연결 중 오류가 발생했습니다.');
      },

      onWebSocketError: () => {
        showToast('error', '채팅 연결에 문제가 발생했습니다.');
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      listSubscriptionRef.current?.unsubscribe();
      listSubscriptionRef.current = null;
      client.deactivate();
      stompClientRef.current = null;
    };
  }, [token, userId]);

  useEffect(() => {
    if (!isSharedWorkerSupported()) return undefined;

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

  // ============================================
  // 폴백: 채팅방 구독
  // ============================================
  useEffect(() => {
    if (isSharedWorkerSupported()) return undefined;

    const client = stompClientRef.current;
    if (!client?.connected || articleId == null || chatroomId == null) return undefined;

    const destination = `/topic/chat/${articleId}/${chatroomId}`;

    subscriptionRef.current = client.subscribe(destination, (message) => {
      try {
        const body = JSON.parse(message.body);
        const formattedMessage: LostItemChatroomDetailMessage = {
          user_id: body.user_id,
          user_nickname: body.user_nickname,
          content: body.content,
          timestamp: body.timestamp,
          is_image: body.is_image,
        };

        const { articleId: currentArticleId, chatroomId: currentChatroomId } = currentRoomRef.current;
        if (articleId === currentArticleId && chatroomId === currentChatroomId) {
          setRealtimeMessages((prev) => [...prev, formattedMessage]);
        }
      } catch {
        showToast('error', '메시지를 불러오는 중 오류가 발생했습니다.');
      }
    });

    return () => {
      subscriptionRef.current?.unsubscribe();
      subscriptionRef.current = null;
      setRealtimeMessages([]);
    };
  }, [articleId, chatroomId, isConnected]);

  const sendMessage = useCallback(
    (message: { user_nickname: string; user_id: number; content: string; timestamp: string; is_image: boolean }) => {
      if (articleId == null || chatroomId == null) return;

      if (isSharedWorkerSupported()) {
        const port = portRef.current;
        if (!port) return;

        port.postMessage({
          type: 'SEND_MESSAGE',
          payload: { articleId, chatroomId, message },
        });
      } else {
        const client = stompClientRef.current;
        if (!client?.connected) return;

        client.publish({
          destination: `/app/chat/${articleId}/${chatroomId}`,
          body: JSON.stringify(message),
          headers: { 'content-type': 'application/json' },
        });
      }
    },
    [articleId, chatroomId],
  );

  const syncMessages = useCallback(
    (messages: LostItemChatroomDetailMessage[]) => {
      if (!isSharedWorkerSupported()) return;

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
      if (!isSharedWorkerSupported()) return;

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
