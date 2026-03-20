import { useCallback, useEffect, useRef } from 'react';
import { isKoinError, sendClientError } from '@bcsdlab/koin';
import {
  keepPreviousData,
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { postLeaveLostItemChatroomV2, postLostItemChatroomMessageV2 } from 'api/articles';
import { articleQueries, articleQueryKeys } from 'api/articles/queries';
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
    ...articleQueries.lostItemChatroomList(token),
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

    const queryKey = articleQueryKeys.lostItemChatroomMessages(defaultArticleId, defaultChatroomId);
    const existing = queryClient.getQueryData(queryKey);
    if (existing) return;

    getCachedMessages(numericArticleId, numericChatroomId).then((cached) => {
      if (cached && cached.length > 0) {
        queryClient.setQueryData(queryKey, cached);
      }
    });
  }, [queryClient, numericArticleId, numericChatroomId, defaultArticleId, defaultChatroomId]);

  const { data: chatroomDetail } = useQuery({
    ...(defaultArticleId && defaultChatroomId && isOnline
      ? articleQueries.lostItemChatroomDetail(token, Number(defaultArticleId), Number(defaultChatroomId))
      : {
          queryKey: articleQueryKeys.lostItemChatroomDetail(defaultArticleId, defaultChatroomId),
          queryFn: skipToken,
        }),
    placeholderData: keepPreviousData,
  });

  const { data: messages } = useQuery({
    ...(defaultArticleId && defaultChatroomId && isOnline
      ? articleQueries.lostItemChatroomMessages(token, Number(defaultArticleId), Number(defaultChatroomId))
      : {
          queryKey: articleQueryKeys.lostItemChatroomMessages(defaultArticleId, defaultChatroomId),
          queryFn: skipToken,
        }),
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

  const { mutate: sendMessage } = useMutation({
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
        queryKey: articleQueryKeys.lostItemChatroomMessages(defaultArticleId, defaultChatroomId),
      });
    },
    onError: (error) => {
      if (isKoinError(error)) {
        showToast('error', error.message || '메시지 전송을 실패하였습니다');
      } else {
        showToast('error', '메시지 전송을 실패하였습니다');
        sendClientError(error);
      }
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
        queryKey: articleQueryKeys.lostItemChatroomList,
      });
    },
    onError: (error) => {
      if (isKoinError(error)) {
        showToast('error', error.message || '채팅방 퇴장을 실패하였습니다');
      } else {
        showToast('error', '채팅방 퇴장을 실패하였습니다');
        sendClientError(error);
      }
    },
  });

  const leaveRoom = useCallback(
    (aId: number, cId: number) => {
      postLeaveLostItemChatroomV2(token, aId, cId).catch((error) => {
        if (isKoinError(error)) {
          showToast('error', error.message || '채팅방 퇴장을 실패하였습니다');
        } else {
          showToast('error', '채팅방 퇴장을 실패하였습니다');
          sendClientError(error);
        }
      });
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

  const invalidateChatroomList = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: articleQueryKeys.lostItemChatroomList,
    });
  }, [queryClient]);

  const invalidateMessages = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: articleQueryKeys.lostItemChatroomMessages(defaultArticleId, defaultChatroomId),
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
