import { useSuspenseQuery } from '@tanstack/react-query';
import { notice } from 'api';

const useArticle = (id: string | undefined) => {
  const { data: article } = useSuspenseQuery(
    {
      queryKey: ['article', id],
      queryFn: async ({ queryKey }) => {
        const queryFnParams = queryKey[1];

        return notice.getArticle(queryFnParams);
      },
    },
  );

  return { article };
};

export default useArticle;
