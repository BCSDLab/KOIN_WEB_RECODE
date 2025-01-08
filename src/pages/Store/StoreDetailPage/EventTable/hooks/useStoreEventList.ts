import * as api from 'api';
import { useQuery } from '@tanstack/react-query';

const useStoreEventList = (id: string) => {
  const { data: storeEventList, isError: isStoreEventListError } = useQuery({
    queryKey: ['storeEventList', id],
    queryFn: ({ queryKey }) => api.store.getStoreEventList(queryKey[1] ?? ''),
  });

  return {
    storeEventList: isStoreEventListError ? undefined : storeEventList,
  };
};

export default useStoreEventList;
