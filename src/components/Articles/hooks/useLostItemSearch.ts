import { useQuery } from '@tanstack/react-query';
import { getLostItemSearch } from 'api/articles';

export const useLostItemSearch = (params: { query: string; page?: number; limit?: number }) => {
  const trimmed = params.query.trim();

  return useQuery({
    queryKey: ['lostItemSearch', trimmed, params.page ?? 1, params.limit ?? 10],
    queryFn: () => getLostItemSearch({ query: trimmed, page: params.page ?? 1, limit: params.limit ?? 10 }),
    enabled: trimmed.length > 0,
  });
};
