import * as api from 'api';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

const useStoreDetail = (id: string) => {
  const { data: storeDetail } = useSuspenseQuery(
    queryOptions({
      queryKey: ['storeDetail', id],
      queryFn: async ({ queryKey }) => {
        const queryFnParams = queryKey[1];

        return api.store.getStoreDetailInfo(queryFnParams);
      },
    }),
  );

  const storeDescription = storeDetail?.description
    ? storeDetail?.description.replace(/(?:\/)/g, '\n')
    : '-';

  return {
    storeDetail,
    storeDescription,
  };
};

export default useStoreDetail;
