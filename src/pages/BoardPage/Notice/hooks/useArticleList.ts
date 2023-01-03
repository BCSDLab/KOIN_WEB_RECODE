import { useQuery } from 'react-query';
import * as api from 'api';

const useArticleList = (board_id: string | undefined) => {
  const { isLoading, data: articleList } = useQuery(
    ['articleList', board_id],
    ({ queryKey }) => api.notice.PostList(queryKey[1]),
    { retry: 0 },
  );

  if (isLoading || articleList === undefined) {
    return null;
  }

  return articleList;
};

export default useArticleList;
