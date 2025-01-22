import { articles } from 'api';
import { useSuspenseQuery } from '@tanstack/react-query';

function useHotArticleList() {
  const { data: hotArticles } = useSuspenseQuery(
    {
      queryKey: ['hotArticles'],
      queryFn: articles.getHotArticles,
    },
  );

  return { hotArticles };
}

export default useHotArticleList;
