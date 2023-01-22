import { useQuery } from 'react-query';
import { NoticeResponse } from 'api/notice/entity';
import * as api from 'api';

const useNoticeDetail = (page: string | undefined, id: string | undefined) => {
  const { data: articleList } = useQuery(
    ['articleList', page],
    ({ queryKey }) => api.notice.PostList(queryKey[1]),
    {
      suspense: true,
      retry: 0,
      select: (data: NoticeResponse) => (
        data.articles.find((el) => String(el.id) === id)
      ),
    },
  );

  return articleList;
};

export default useNoticeDetail;
