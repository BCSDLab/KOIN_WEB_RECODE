import { useSuspenseQuery } from '@tanstack/react-query';
import { getArticle } from 'api/articles';

const useArticle = (id: string | undefined) => {
  const { data: article } = useSuspenseQuery({
    queryKey: ['article', id],
    queryFn: async ({ queryKey }) => {
      const queryFnParams = queryKey[1];

      return getArticle(queryFnParams);
    },
  });

  return { article };
};

export default useArticle;
