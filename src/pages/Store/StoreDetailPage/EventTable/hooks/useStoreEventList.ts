import { useQuery } from '@tanstack/react-query';
import * as api from 'api';

const useStoreEventList = (id: string) => {
  const { data: storeEventList, isError: isStoreEventListError } = useQuery({
    queryKey: ['storeEventList', id],
    queryFn: ({ queryKey }) => api.store.getStoreEventList(queryKey[1] ?? ''),
  });

  return {
    storeEventList: isStoreEventListError ? null : storeEventList,
  };
};

export default useStoreEventList;
