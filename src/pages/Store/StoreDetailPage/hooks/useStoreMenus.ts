import * as api from 'api';
import { useSuspenseQuery } from '@tanstack/react-query';

const useStoreMenus = (params: string) => {
  const { data } = useSuspenseQuery({
    queryKey: ['storeDetailMenu', params],
    queryFn: async ({ queryKey }) => {
      const queryFnParams = queryKey[1];

      return api.store.getStoreDetailMenu(queryFnParams);
    },
  });

  return { data };
};

export default useStoreMenus;
