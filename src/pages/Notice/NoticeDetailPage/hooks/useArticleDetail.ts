import { useQuery } from 'react-query';
import * as api from 'api';

const useNoticeDetail = (id: string | undefined) => {
  const { data: articleList } = useQuery(
    ['articleList', id],
    ({ queryKey }) => api.notice.Post(queryKey[1]),
    {
      suspense: true,
      retry: 0,
    },
  );

  return articleList;
};

export default useNoticeDetail;
