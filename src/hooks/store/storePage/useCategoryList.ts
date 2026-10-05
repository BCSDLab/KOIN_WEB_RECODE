import { useSuspenseQuery } from '@tanstack/react-query';
import { getStoreCategories } from 'api/store';

export const useStoreCategories = () => {
  const { data } = useSuspenseQuery({
    queryKey: ['storeCategories'],
    queryFn: getStoreCategories,
  });

  return { data };
};
