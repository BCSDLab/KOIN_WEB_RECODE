import { useQuery } from 'react-query';
import * as api from 'api';

const useStoreDetail = (params: string | undefined) => {
  const { data: storeDetail } = useQuery(
    ['storeDetail', params],
    ({ queryKey }) => api.store.getStoreDetailInfo(queryKey[1]),
    {
      retry: 0,
      // 임시 처리, 추후 요일별 시간 디자인이 나온 경우 필요 없어짐
      select: (response) => ({
        ...response,
        open_time: response.open[0].open_time,
        close_time: response.open[0].close_time,
      }),
    },
  );
  const storeDescription = storeDetail?.description ? storeDetail?.description.replace(/(?:\/)/g, '\n') : '-';

  return {
    storeDetail,
    storeDescription,
  };
};

export default useStoreDetail;
