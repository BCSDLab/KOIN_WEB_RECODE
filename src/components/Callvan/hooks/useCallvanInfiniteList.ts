import { useInfiniteQuery } from '@tanstack/react-query';
import { getCallvanList } from 'api/callvan';
import { CallvanListRequest } from 'api/callvan/entity';
import useTokenState from 'utils/hooks/state/useTokenState';

const LIMIT = 10;

export const useCallvanInfiniteList = (params: Omit<CallvanListRequest, 'page' | 'limit'>) => {
  const token = useTokenState();

  return useInfiniteQuery({
    queryKey: ['callvanInfiniteList', params],
    queryFn: ({ pageParam = 1 }) =>
      getCallvanList(token, {
        ...params,
        page: pageParam,
        limit: LIMIT,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.current_page < lastPage.total_page) {
        return lastPage.current_page + 1;
      }
      return undefined;
    },
  });
};

export default useCallvanInfiniteList;
