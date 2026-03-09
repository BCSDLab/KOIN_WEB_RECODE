import { useSuspenseQuery } from '@tanstack/react-query';
import { getCallvanPostDetail } from 'api/callvan';
import useTokenState from 'utils/hooks/state/useTokenState';

export const CALLVAN_POST_DETAIL_QUERY_KEY = (postId: number) => ['callvanPostDetail', postId];

const useCallvanPostDetail = (postId: number) => {
  const token = useTokenState();

  return useSuspenseQuery({
    queryKey: CALLVAN_POST_DETAIL_QUERY_KEY(postId),
    queryFn: () => getCallvanPostDetail(token, postId),
    staleTime: 60000,
  });
};

export default useCallvanPostDetail;
