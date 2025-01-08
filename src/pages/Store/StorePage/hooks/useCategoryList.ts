import { getStoreCategories } from 'api/store';
import { useSuspenseQuery } from '@tanstack/react-query';

export const useStoreCategories = () => {
  const { data } = useSuspenseQuery({
    queryKey: ['storeCategories'],
    queryFn: getStoreCategories,
  });

  return { data };
};
