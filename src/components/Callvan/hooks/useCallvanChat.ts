import { useSuspenseQuery } from '@tanstack/react-query';
import { getCallvanChat } from 'api/callvan';
import useTokenState from 'utils/hooks/state/useTokenState';

export const CALLVAN_CHAT_QUERY_KEY = (postId: number) => ['callvanChat', postId];

const useCallvanChat = (postId: number) => {
  const token = useTokenState();

  return useSuspenseQuery({
    queryKey: CALLVAN_CHAT_QUERY_KEY(postId),
    queryFn: () => getCallvanChat(token, postId),
    staleTime: 0,
  });
};

export default useCallvanChat;
