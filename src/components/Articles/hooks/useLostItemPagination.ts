import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getLostItemArticles } from 'api/articles';
import { LostItemArticlesRequest } from 'api/articles/entity';
import useTokenState from 'utils/hooks/state/useTokenState';

export const useLostItemPagination = (params: LostItemArticlesRequest) => {
  const token = useTokenState();

  return useQuery({
    queryKey: ['lostItemPagination', params],
    queryFn: () => getLostItemArticles(token, params),
    placeholderData: keepPreviousData,
    select: (data) => ({
      articles: data.articles,
      paginationInfo: {
        total_count: data.total_count,
        current_count: data.current_count,
        total_page: data.total_page,
        current_page: data.current_page,
      },
    }),
  });
};

export default useLostItemPagination;
