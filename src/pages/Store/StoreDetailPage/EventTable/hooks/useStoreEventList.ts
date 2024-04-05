import { useQuery } from 'react-query';
import * as api from 'api';

const useStoreEventList = (id: string) => {
  const { data: storeEventList, isError: isStoreEventListError } = useQuery(
    ['storeEventList', id],
    ({ queryKey }) => api.store.getStoreEventList(queryKey[1] ?? ''),
  );

  return {
    storeEventList: isStoreEventListError ? null : storeEventList,
  };
};

export default useStoreEventList;
