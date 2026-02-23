import { useSuspenseQuery } from '@tanstack/react-query';
import { getStoreDetailMenu } from 'api/store';

const useStoreMenus = (params: string) => {
  const { data } = useSuspenseQuery({
    queryKey: ['storeDetailMenu', params],
    queryFn: async ({ queryKey }) => {
      const queryFnParams = queryKey[1];

      return getStoreDetailMenu(queryFnParams);
    },
  });

  return { data };
};

export default useStoreMenus;
