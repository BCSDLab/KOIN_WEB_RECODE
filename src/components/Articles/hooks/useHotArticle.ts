import { useSuspenseQuery } from '@tanstack/react-query';
import { articles } from 'api';

function useHotArticleList() {
  const { data: hotArticles } = useSuspenseQuery({
    queryKey: ['hotArticles'],
    queryFn: articles.getHotArticles,
  });

  return { hotArticles };
}

export default useHotArticleList;
