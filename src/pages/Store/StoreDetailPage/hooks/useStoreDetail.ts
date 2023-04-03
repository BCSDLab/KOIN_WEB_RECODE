import { useQuery } from 'react-query';
import * as api from 'api';

const useStoreDetail = (params: string | undefined) => {
  const { data: storeDetail } = useQuery(
    ['storeDetail', params],
    ({ queryKey }) => api.store.getStoreDetailInfo(queryKey[1]),
    { retry: 0 },
  );
  const storeDescription = storeDetail?.description ? storeDetail?.description.replace(/(?:\/)/g, '\n') : '-';

  return {
    storeDetail,
    storeDescription,
  };
};

export default useStoreDetail;
