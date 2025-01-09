import { useSuspenseQuery } from '@tanstack/react-query';
import { notice } from 'api';

function useHotArticleList() {
  const { data: hotArticles } = useSuspenseQuery({
    queryKey: ['hotArticles'],
    queryFn: notice.getHotArticles,
  });

  return { hotArticles };
}

export default useHotArticleList;
