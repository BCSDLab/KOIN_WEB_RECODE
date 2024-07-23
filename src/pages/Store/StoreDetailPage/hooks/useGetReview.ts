import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { getReviewList } from 'api/store';

export const useGetReview = (id: number) => {
  const { data, hasNextPage, fetchNextPage } = useSuspenseInfiniteQuery({
    queryKey: ['review', id],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => getReviewList(id, pageParam),
    getNextPageParam: (last) => last.current_page + 1,
  });

  return { data, hasNextPage, fetchNextPage };
};
