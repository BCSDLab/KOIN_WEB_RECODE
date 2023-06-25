import { useQuery } from 'react-query';
import * as api from 'api';

const useStoreDetail = (params: string | undefined) => {
  const { data: storeDetail, isError: storeDetailError } = useQuery(
    ['storeDetail', params],
    ({ queryKey }) => api.store.getStoreDetailInfo(queryKey[1] ?? ''),
  );
  const storeDescription = storeDetail?.description ? storeDetail?.description.replace(/(?:\/)/g, '\n') : '-';
  const { data: storeMenus, isError: storeMenusError } = useQuery(
    ['storeDetailMenu', params],
    ({ queryKey }) => api.store.getStoreDetailMenu(queryKey[1] ?? ''),
  );

  if (storeMenusError || storeDetailError) {
    return {
      storeDetail: null,
      storeDescription: null,
      storeMenus: null,
    };
  }

  return {
    storeDetail,
    storeDescription,
    storeMenus,
  };
};

export default useStoreDetail;
