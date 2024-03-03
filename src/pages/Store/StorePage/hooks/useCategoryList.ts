import { getStoreCategories } from 'api/store';
import { useQuery } from 'react-query';

export const useStoreCategories = () => {
  const { data } = useQuery({
    queryKey: ['storeCategories'],
    queryFn: getStoreCategories,
  });

  return { data };
};
