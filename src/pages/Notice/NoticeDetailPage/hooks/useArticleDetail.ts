import { useSuspenseQuery } from '@tanstack/react-query';
import * as api from 'api';

const useNoticeDetail = (id: string | undefined) => {
  const { data: articleList } = useSuspenseQuery(
    {
      queryKey: ['articleList', id],
      queryFn: async ({ queryKey }) => {
        const queryFnParams = queryKey[1];

        return api.notice.Post(queryFnParams);
      },
    },
  );

  return articleList;
};

export default useNoticeDetail;
