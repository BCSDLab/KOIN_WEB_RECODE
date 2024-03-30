import * as api from 'api';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

const useStoreMenus = (params: string) => {
  const { data } = useSuspenseQuery(
    queryOptions({
      queryKey: ['storeDetailMenu', params],
      queryFn: async ({ queryKey }) => {
        const queryFnParams = queryKey[1];

        return api.store.getStoreDetailMenu(queryFnParams);
      },
    }),
  );

  return { data };
};

export default useStoreMenus;
