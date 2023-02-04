import { useQuery } from 'react-query';
import * as api from 'api';

const useArticleList = (page: string | undefined) => {
  const { isLoading, data: articleList } = useQuery(
    ['articleList', page],
    ({ queryKey }) => api.notice.PostList(queryKey[1]),
    { retry: 0 },
  );

  if (isLoading || articleList === undefined) {
    return null;
  }

  return articleList;
};

export default useArticleList;
