import { useQuery } from 'react-query';
import * as api from 'api';

const useStoreEventList = (id: string) => {
  const { data: storeEventList, isError: isStoreEvnetListError } = useQuery(
    ['storeEventList', id],
    ({ queryKey }) => api.store.getStoreEventList(queryKey[1] ?? ''),
  );

  return {
    storeEventList: isStoreEvnetListError ? null : storeEventList,
  };
};

export default useStoreEventList;
