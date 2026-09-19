import { useQuery } from '@tanstack/react-query';
import { getRelateSearch } from 'api/store';

export const useRelateSearch = (query: string) => {
  const { data } = useQuery({
    queryKey: ['relateSearch', query],
    queryFn: () => getRelateSearch(query),
  });

  return { data };
};
