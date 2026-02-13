import { useQuery } from '@tanstack/react-query';
import { getStoreEventList } from 'api/store';

const useStoreEventList = (id: string) => {
  const { data: storeEventList, isError: isStoreEventListError } = useQuery({
    queryKey: ['storeEventList', id],
    queryFn: ({ queryKey }) => getStoreEventList(queryKey[1] ?? ''),
  });

  return {
    storeEventList: isStoreEventListError ? undefined : storeEventList,
  };
};

export default useStoreEventList;
