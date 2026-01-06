import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ArticleWithNew, PaginationInfo } from 'api/articles/entity';
import { articles as articlesApi } from 'api/index';
import { isNewArticle } from 'components/Articles/utils/setArticleRegisteredDate';
import useTokenState from 'utils/hooks/state/useTokenState';

const useArticles = (page = '1') => {
  const token = useTokenState();

  const { data: articleData } = useQuery({
    queryKey: ['articles', page],
    queryFn: async () => {
      // if (!token) throw new Error('🚨 로그인 토큰이 필요합니다.');

      const queryFnParams = page;

      return articlesApi.getArticles(token, queryFnParams);
    },
    placeholderData: keepPreviousData,
    select: (data) => {
      const {
        // 일관성을 유지하기 위해 변수명을 변경하지 않았습니다.
        articles,
        total_count,
        current_count,
        total_page,
        current_page,
      } = data;

      const currentDate = new Date();
      const articlesWithNew: ArticleWithNew[] = articles.map((article) => ({
        ...article,
        isNew: isNewArticle(article.registered_at, currentDate),
      }));

      const paginationInfo: PaginationInfo = {
        total_count,
        current_count,
        total_page,
        current_page,
      };

      return { articles: articlesWithNew, paginationInfo };
    },
  });

  return articleData;
};

export default useArticles;
