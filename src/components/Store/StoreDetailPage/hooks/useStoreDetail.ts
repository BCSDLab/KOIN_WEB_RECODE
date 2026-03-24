import { useSuspenseQuery } from '@tanstack/react-query';
import { storeQueries } from 'api/store/queries';

const useStoreDetail = (id: string) => {
  const { data: storeDetail } = useSuspenseQuery(storeQueries.detail(id));

  const storeDescription = storeDetail?.description ? storeDetail?.description.replace(/(?:\/)/g, '\n') : '-';

  return {
    storeDetail,
    storeDescription,
  };
};

export default useStoreDetail;
