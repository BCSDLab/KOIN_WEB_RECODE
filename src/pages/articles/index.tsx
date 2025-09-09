import Pagination from 'components/Articles/components/Pagination';
import ArticlesHeader from 'components/Articles/components/ArticlesHeader';
import ArticleList from 'components/Articles/components/ArticleList';
import usePageParams from 'components/Articles/hooks/usePageParams';
import useArticles from 'components/Articles/hooks/useArticles';
import { Suspense } from 'react';
import ArticlesPageLayout from 'components/Articles/ArticlesPage';

export default function ArticleListPage() {
  const paramsPage = usePageParams();
  const { articles, paginationInfo } = useArticles(paramsPage);

  return (
    <ArticlesPageLayout>
      <ArticlesHeader />
      <Suspense fallback={null}>
        <ArticleList articles={articles} />
        <Pagination totalPageNum={articles === null ? 5 : paginationInfo.total_count} />
      </Suspense>
    </ArticlesPageLayout>
  );
}
