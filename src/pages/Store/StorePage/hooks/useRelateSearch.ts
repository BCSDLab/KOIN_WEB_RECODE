import { getRelateSearch } from 'api/store';
import { useQuery } from '@tanstack/react-query';

export const useRelateSearch = (query: string) => {
  const { data } = useQuery({
    queryKey: ['relateSearch'],
    queryFn: () => getRelateSearch(query),
  });

  return { data };
};
