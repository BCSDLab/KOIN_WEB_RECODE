import { useQuery } from 'react-query';
import * as api from 'api';
import parse from 'html-react-parser';

const useStoreDetail = (params: string | undefined) => {
  const { data: storeDetail } = useQuery(
    ['storeDetail', params],
    ({ queryKey }) => api.store.getStoreDetailInfo(queryKey[1]),
    { retry: 0 },
  );
  const storeDescription = storeDetail?.description ? parse(storeDetail?.description.replace(/(?:\\r\\n|\/|\\r|\\n|\r|\n|\r\n)/g, '<br />')) : '-';

  return {
    storeDetail,
    storeDescription,
  };
};

export default useStoreDetail;
