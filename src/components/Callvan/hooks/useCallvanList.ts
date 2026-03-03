import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getCallvanList } from 'api/callvan';
import { CallvanListRequest } from 'api/callvan/entity';
import useTokenState from 'utils/hooks/state/useTokenState';

export const useCallvanList = (params: CallvanListRequest) => {
  const token = useTokenState();

  return useQuery({
    queryKey: ['callvanList', params],
    queryFn: () => getCallvanList(token, params),
    placeholderData: keepPreviousData,
    select: (data) => ({
      posts: data.posts,
      paginationInfo: {
        total_count: data.total_count,
        current_page: data.current_page,
        total_page: data.total_page,
      },
    }),
  });
};

export default useCallvanList;
