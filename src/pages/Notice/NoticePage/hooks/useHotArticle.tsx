import * as api from 'api';
import { useSuspenseQuery } from '@tanstack/react-query';

function useHotArticleList() {
  const { data: hotArticleList } = useSuspenseQuery(
    {
      queryKey: ['hotArticleList'],
      queryFn: api.notice.HotPostList,
    },
  );

  return hotArticleList;
}

export default useHotArticleList;
