import { getReviewList } from 'api/store';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

export const useGetReview = (id: number, sorter: string) => {
  const token = useTokenState();
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery({
    queryKey: ['review', id, sorter],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => getReviewList(id, pageParam, sorter, token),
    getNextPageParam: (last) => {
      if (last.total_page > last.current_page) return last.current_page + 1;
      return undefined; // 마지막 페이지면 무한 스크롤 중단
    },
  });

  return {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  };
};
