import { skipToken, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getLostItemChatroomDetail, getLostItemChatroomDetailMessages, getLostItemChatroomList } from 'api/articles';

const useChatroomQuery = (
  token: string,
  articleId: number | string | null,
  chatroomId: number | string | null,
) => {
  const { data: chatroomList } = useSuspenseQuery({
    queryKey: ['chatroom', 'lost-item'],
    queryFn: () => getLostItemChatroomList(token),
  });

  const defaultChatroomId = chatroomId || chatroomList[0].chat_room_id;
  const defaultArticleId = articleId || chatroomList[0].article_id;

  const { data: chatroomDetail } = useQuery({
    queryKey: ['chatroom', 'lost-item', articleId, chatroomId],
    queryFn: (articleId && chatroomId)
      ? () => getLostItemChatroomDetail(token, Number(articleId), Number(defaultChatroomId))
      : skipToken,
  });
  const { data: messages } = useQuery({
    queryKey: ['chatroom', 'lost-item', articleId, chatroomId, 'messages'],
    queryFn: (articleId && chatroomId)
      ? () => getLostItemChatroomDetailMessages(token, Number(articleId), Number(defaultChatroomId))
      : skipToken,
  });

  return {
    chatroomList,
    chatroomDetail,
    messages,
    defaultChatroomId,
    defaultArticleId,
  };
};

export default useChatroomQuery;
