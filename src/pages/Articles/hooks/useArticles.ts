import { useSuspenseQuery } from '@tanstack/react-query';
import { articles as articlesApi } from 'api/index';
import { PaginationInfo } from 'api/articles/entity';

const useArticles = (page = '1') => {
  const { data: articleData } = useSuspenseQuery(
    {
      queryKey: ['articles', page],
      queryFn: async () => {
        const queryFnParams = page;

        return articlesApi.getArticles(queryFnParams);
      },
      select: (data) => {
        const {
          // 일관성을 유지하기 위해 변수명을 변경하지 않았습니다.
          // eslint-disable-next-line @typescript-eslint/naming-convention
          articles, total_count, current_count, total_page, current_page,
        } = data;

        const paginationInfo: PaginationInfo = {
          total_count, current_count, total_page, current_page,
        };

        return { articles, paginationInfo };
      },
    },
  );

  return articleData;
};

export default useArticles;
