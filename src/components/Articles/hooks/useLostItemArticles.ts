import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { articles } from 'api';
import { LostItemArticlesRequest } from 'api/articles/entity';
import useTokenState from 'utils/hooks/state/useTokenState';

const useLostItemArticles = (params: LostItemArticlesRequest) => {
  const token = useTokenState();

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery({
    queryKey: ['lostItem', params],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => articles.getLostItemArticles(token, { ...params, page: pageParam }),
    getNextPageParam: (last) => {
      if (last.total_page > last.current_page) return last.current_page + 1;
      return undefined;
    },
  });

  return {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  };
};

export default useLostItemArticles;
