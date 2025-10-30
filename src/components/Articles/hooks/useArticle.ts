import { useSuspenseQuery } from '@tanstack/react-query';
import { articles } from 'api';

const useArticle = (id: string | undefined) => {
  const { data: article } = useSuspenseQuery({
    queryKey: ['article', id],
    queryFn: async ({ queryKey }) => {
      const queryFnParams = queryKey[1];

      return articles.getArticle(queryFnParams);
    },
  });

  return { article };
};

export default useArticle;
