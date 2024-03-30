import { queryOptions, useQuery } from '@tanstack/react-query';
import { getStoreCategories } from 'api/store';

export const useStoreCategories = () => {
  const { data } = useQuery(
    queryOptions({
      queryKey: ['storeCategories'],
      queryFn: getStoreCategories,

    }),
  );

  return { data };
};
