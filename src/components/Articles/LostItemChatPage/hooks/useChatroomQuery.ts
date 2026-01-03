import { useCallback } from 'react';
import { keepPreviousData, skipToken, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getLostItemChatroomDetail, getLostItemChatroomDetailMessages, getLostItemChatroomList } from 'api/articles';

const useChatroomQuery = (token: string, articleId: number | string | null, chatroomId: number | string | null) => {
  const queryClient = useQueryClient();

  const { data: chatroomList } = useSuspenseQuery({
    queryKey: ['chatroom', 'lost-item', 'list'],
    queryFn: () => getLostItemChatroomList(token),
  });

  const defaultChatroomId = chatroomId ?? chatroomList?.[0]?.chat_room_id ?? null;
  const defaultArticleId = articleId ?? chatroomList?.[0]?.article_id ?? null;

  const { data: chatroomDetail } = useQuery({
    queryKey: ['chatroom', 'lost-item', 'detail', defaultArticleId, defaultChatroomId],
    queryFn:
      defaultArticleId && defaultChatroomId
        ? () => getLostItemChatroomDetail(token, Number(defaultArticleId), Number(defaultChatroomId))
        : skipToken,
    placeholderData: keepPreviousData,
  });

  const { data: messages } = useQuery({
    queryKey: ['chatroom', 'lost-item', 'messages', defaultArticleId, defaultChatroomId],
    queryFn:
      defaultArticleId && defaultChatroomId
        ? () => getLostItemChatroomDetailMessages(token, Number(defaultArticleId), Number(defaultChatroomId))
        : skipToken,
    placeholderData: keepPreviousData,
  });

  const invalidateChatroomList = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ['chatroom', 'lost-item', 'list'],
    });
  }, [queryClient]);

  return {
    chatroomList,
    chatroomDetail,
    messages,
    defaultChatroomId,
    defaultArticleId,
    invalidateChatroomList,
  };
};

export default useChatroomQuery;
