import { useQuery } from 'react-query';
import * as api from 'api';

const useStoreDetail = (params: string) => {
  const { data: storeDetail, isError: isStoreDetailError } = useQuery(
    ['storeDetail', params],
    ({ queryKey }) => api.store.getStoreDetailInfo(queryKey[1] ?? ''),
  );
  const storeDescription = storeDetail?.description ? storeDetail?.description.replace(/(?:\/)/g, '\n') : '-';

  return {
    storeDetail: isStoreDetailError ? null : storeDetail,
    storeDescription,
  };
};

export default useStoreDetail;
