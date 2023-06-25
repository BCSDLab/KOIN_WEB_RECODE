import { useQuery } from 'react-query';
import * as api from 'api';

const useStoreMenus = (params: string) => {
  const { data: storeMenus, isError: isStoreMenuError } = useQuery(
    ['storeDetailMenu', params],
    ({ queryKey }) => api.store.getStoreDetailMenu(queryKey[1] ?? ''),
  );

  return {
    storeMenus: isStoreMenuError ? null : storeMenus,
  };
};

export default useStoreMenus;
