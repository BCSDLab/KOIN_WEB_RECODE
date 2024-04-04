import * as api from 'api';

import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

function useHotArticleList() {
  const { data: hotArticleList } = useSuspenseQuery(
    queryOptions({
      queryKey: ['hotArticleList'],
      queryFn: api.notice.HotPostList,
    }),
  );

  return hotArticleList;
}

export default useHotArticleList;
