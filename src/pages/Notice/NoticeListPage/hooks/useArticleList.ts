import { queryOptions, useQuery } from '@tanstack/react-query';
import * as api from 'api';

const useArticleList = (page: string | undefined) => {
  const { isLoading, data: articleList } = useQuery(
    queryOptions({
      queryKey: ['articleList', page],
      queryFn: async ({ queryKey }) => {
        const queryFnParams = queryKey[1];

        return api.notice.PostList(queryFnParams);
      },

    }),
  );

  if (isLoading || articleList === undefined) {
    return null;
  }

  return articleList;
};

export default useArticleList;
