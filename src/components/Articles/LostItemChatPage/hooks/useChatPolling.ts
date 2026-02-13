import { useCallback, useEffect, useRef } from 'react';
import {
  keepPreviousData,
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  getLostItemChatroomDetail,
  getLostItemChatroomList,
  getLostItemChatroomMessagesV2,
  postLeaveLostItemChatroomV2,
  postLostItemChatroomMessageV2,
} from 'api/articles';
import { getCachedMessages, cacheMessages, clearChatroomCache } from 'utils/db/chatDB';
import showToast from 'utils/ts/showToast';

const POLLING_INTERVAL_MS = 10_000;

interface UseChatPollingOptions {
  token: string;
  articleId: number | string | null;
  chatroomId: number | string | null;
  isOnline?: boolean;
}

const useChatPolling = ({ token, articleId, chatroomId, isOnline = true }: UseChatPollingOptions) => {
  const queryClient = useQueryClient();

  const { data: chatroomList } = useSuspenseQuery({
    queryKey: ['chatroom', 'lost-item', 'list'],
    queryFn: () => getLostItemChatroomList(token),
    staleTime: isOnline ? 0 : Infinity,
    refetchInterval: isOnline ? POLLING_INTERVAL_MS : false,
    refetchIntervalInBackground: false,
  });

  const defaultChatroomId = chatroomId ?? chatroomList?.[0]?.chat_room_id ?? null;
  const defaultArticleId = articleId ?? chatroomList?.[0]?.article_id ?? null;

  const numericArticleId = defaultArticleId != null ? Number(defaultArticleId) : null;
  const numericChatroomId = defaultChatroomId != null ? Number(defaultChatroomId) : null;

  // indexedDB 진입
  useEffect(() => {
    if (numericArticleId == null || numericChatroomId == null) return;

    const queryKey = ['chatroom', 'lost-item', 'messages', defaultArticleId, defaultChatroomId];
    const existing = queryClient.getQueryData(queryKey);
    if (existing) return;

    getCachedMessages(numericArticleId, numericChatroomId).then((cached) => {
      if (cached && cached.length > 0) {
        queryClient.setQueryData(queryKey, cached);
      }
    });
  }, [queryClient, numericArticleId, numericChatroomId, defaultArticleId, defaultChatroomId]);

  const { data: chatroomDetail } = useQuery({
    queryKey: ['chatroom', 'lost-item', 'detail', defaultArticleId, defaultChatroomId],
    queryFn:
      defaultArticleId && defaultChatroomId && isOnline
        ? () => getLostItemChatroomDetail(token, Number(defaultArticleId), Number(defaultChatroomId))
        : skipToken,
    placeholderData: keepPreviousData,
  });

  const { data: messages } = useQuery({
    queryKey: ['chatroom', 'lost-item', 'messages', defaultArticleId, defaultChatroomId],
    queryFn:
      defaultArticleId && defaultChatroomId && isOnline
        ? () => getLostItemChatroomMessagesV2(token, Number(defaultArticleId), Number(defaultChatroomId))
        : skipToken,
    placeholderData: keepPreviousData,
    refetchInterval: isOnline && defaultArticleId && defaultChatroomId ? POLLING_INTERVAL_MS : false,
    refetchIntervalInBackground: false,
  });

  // 폴링 응답 도착 시 indexedDB 캐시
  useEffect(() => {
    if (messages && messages.length > 0 && numericArticleId != null && numericChatroomId != null) {
      cacheMessages(numericArticleId, numericChatroomId, messages);
    }
  }, [messages, numericArticleId, numericChatroomId]);

  const leaveRoom = useCallback(
    (aId: number, cId: number) => {
      postLeaveLostItemChatroomV2(token, aId, cId).catch(() => {});
    },
    [token],
  );

  const prevRoomRef = useRef<{ articleId: number; chatroomId: number } | null>(null);

  useEffect(() => {
    if (numericArticleId != null && numericChatroomId != null) {
      if (
        prevRoomRef.current &&
        (prevRoomRef.current.articleId !== numericArticleId || prevRoomRef.current.chatroomId !== numericChatroomId)
      ) {
        leaveRoom(prevRoomRef.current.articleId, prevRoomRef.current.chatroomId);
      }
      prevRoomRef.current = { articleId: numericArticleId, chatroomId: numericChatroomId };
    }

    return () => {
      if (prevRoomRef.current) {
        leaveRoom(prevRoomRef.current.articleId, prevRoomRef.current.chatroomId);
        prevRoomRef.current = null;
      }
    };
  }, [numericArticleId, numericChatroomId, leaveRoom]);

  const { mutateAsync: sendMessage } = useMutation({
    mutationFn: ({ content, isImage = false }: { content: string; isImage?: boolean }) => {
      if (defaultArticleId == null || defaultChatroomId == null) {
        return Promise.reject(new Error('채팅방 정보가 없습니다.'));
      }

      return postLostItemChatroomMessageV2(token, Number(defaultArticleId), Number(defaultChatroomId), {
        content,
        is_image: isImage,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['chatroom', 'lost-item', 'messages', defaultArticleId, defaultChatroomId],
      });
    },
    onError: () => {
      showToast('error', '메세지 전송에 실패했습니다.');
    },
  });

  const { mutateAsync: leaveChatroom } = useMutation({
    mutationFn: () => {
      if (defaultArticleId == null || defaultChatroomId == null) {
        return Promise.reject(new Error('채팅방 정보가 없습니다.'));
      }

      return postLeaveLostItemChatroomV2(token, Number(defaultArticleId), Number(defaultChatroomId));
    },
    onSuccess: () => {
      if (numericArticleId != null && numericChatroomId != null) {
        clearChatroomCache(numericArticleId, numericChatroomId);
      }
      queryClient.invalidateQueries({
        queryKey: ['chatroom', 'lost-item', 'list'],
      });
    },
    onError: () => {
      showToast('error', '채팅방 퇴장에 실패했습니다.');
    },
  });

  const invalidateChatroomList = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ['chatroom', 'lost-item', 'list'],
    });
  }, [queryClient]);

  const invalidateMessages = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ['chatroom', 'lost-item', 'messages', defaultArticleId, defaultChatroomId],
    });
  }, [queryClient, defaultArticleId, defaultChatroomId]);

  return {
    chatroomList,
    chatroomDetail,
    messages,
    defaultChatroomId,
    defaultArticleId,
    sendMessage,
    leaveChatroom,
    invalidateChatroomList,
    invalidateMessages,
  };
};

export default useChatPolling;
