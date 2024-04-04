import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import * as api from 'api';

const useArticleList = (page: string | undefined) => {
  const { data: articleList } = useSuspenseQuery(
    queryOptions({
      queryKey: ['articleList', page],
      queryFn: async ({ queryKey }) => {
        const queryFnParams = queryKey[1];

        return api.notice.PostList(queryFnParams);
      },
    }),
  );

  return articleList;
};

export default useArticleList;
