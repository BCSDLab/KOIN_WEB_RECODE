import { useSuspenseQuery } from '@tanstack/react-query';
import * as api from 'api';

const useStoreDetail = (id: string) => {
  const { data: storeDetail } = useSuspenseQuery({
    queryKey: ['storeDetail', id],
    queryFn: async ({ queryKey }) => {
      const queryFnParams = queryKey[1];

      return api.store.getStoreDetailInfo(queryFnParams);
    },
  });

  const storeDescription = storeDetail?.description ? storeDetail?.description.replace(/(?:\/)/g, '\n') : '-';

  return {
    storeDetail,
    storeDescription,
  };
};

export default useStoreDetail;
