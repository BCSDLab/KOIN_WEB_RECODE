import { useCallback } from 'react';
import {
  keepPreviousData,
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { getLostItemChatroomDetail, getLostItemChatroomList } from 'api/articles';
import {
  GetLostItemChatroomMessagesV2,
  PostLostItemChatroomMessageV2,
  PostLeaveLostItemChatroomV2,
} from 'api/articles/ChatAPIDetailV2';
import APIClient from 'utils/ts/apiClient';
import showToast from 'utils/ts/showToast';

const POLLING_INTERVAL_MS = 10_000;

const getLostItemChatroomMessagesV2 = APIClient.of(GetLostItemChatroomMessagesV2);
const postLostItemChatroomMessageV2 = APIClient.of(PostLostItemChatroomMessageV2);
const postLeaveLostItemChatroomV2 = APIClient.of(PostLeaveLostItemChatroomV2);

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
