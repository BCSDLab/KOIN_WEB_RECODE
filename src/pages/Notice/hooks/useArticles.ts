import { useSuspenseQuery } from '@tanstack/react-query';
import { notice } from 'api';

const useArticles = (page = '1') => {
  const { data: articleData } = useSuspenseQuery(
    {
      queryKey: ['articles', page],
      queryFn: async () => {
        const queryFnParams = page;

        return notice.getArticles(queryFnParams);
      },
      select: (data) => {
        const {
          // 일관성을 유지하기 위해 변수명을 변경하지 않았습니다.
          // eslint-disable-next-line @typescript-eslint/naming-convention
          articles, total_count, current_count, total_page, current_page,
        } = data;

        const pageData = {
          total_count, current_count, total_page, current_page,
        };

        return { articles, pageData };
      },
    },
  );

  return articleData;
};

export default useArticles;
