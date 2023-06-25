import { useQuery } from 'react-query';
import * as api from 'api';

const useStoreDetail = (params: string) => {
  const { data: storeDetail } = useQuery(
    ['storeDetail', params],
    ({ queryKey }) => api.store.getStoreDetailInfo(queryKey[1]),
    {
      retry: 0,
    },
  );
  const storeDescription = storeDetail?.description ? storeDetail?.description.replace(/(?:\/)/g, '\n') : '-';
  const { data: storeMenus } = useQuery(
    ['storeDetailMenu', params],
    ({ queryKey }) => api.store.getStoreDetailMenu(queryKey[1]),
    {
      retry: 0,
    },
  );

  return {
    storeDetail,
    storeDescription,
    storeMenus,
  };
};

export default useStoreDetail;
