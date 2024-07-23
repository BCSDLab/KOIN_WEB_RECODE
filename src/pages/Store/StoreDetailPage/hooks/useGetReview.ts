import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { getReviewList } from 'api/store';
import useTokenState from 'utils/hooks/useTokenState';

export const useGetReview = (id: number) => {
  const token = useTokenState();
  const { data, hasNextPage, fetchNextPage } = useSuspenseInfiniteQuery({
    queryKey: ['review', id],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => getReviewList(id, pageParam, token),
    getNextPageParam: (last) => last.current_page + 1,
  });

  return { data, hasNextPage, fetchNextPage };
};
