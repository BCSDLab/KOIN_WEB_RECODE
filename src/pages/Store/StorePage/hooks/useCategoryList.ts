import { useQuery } from '@tanstack/react-query';
import { getStoreCategories } from 'api/store';

export const useStoreCategories = () => {
  const { data } = useQuery(
    {
      queryKey: ['storeCategories'],
      queryFn: getStoreCategories,
    },
  );

  return { data };
};
