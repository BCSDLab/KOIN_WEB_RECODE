import ArticlesPageLayout from 'components/Articles/ArticlesPage';
import ArticleList from 'components/Articles/components/ArticleList';
import ArticlesHeader from 'components/Articles/components/ArticlesHeader';
import Pagination from 'components/Articles/components/Pagination';
import useArticles from 'components/Articles/hooks/useArticles';
import usePageParams from 'components/Articles/hooks/usePageParams';
import Suspense from 'components/ssr/SSRSuspense';

function ArticleListPage() {
  const paramsPage = usePageParams();
  const { articles, paginationInfo } = useArticles(paramsPage);

  return (
    <ArticlesPageLayout>
      <ArticlesHeader />
      <ArticleList articles={articles} />
      <Pagination totalPageNum={articles === null ? 5 : paginationInfo.total_count} />
    </ArticlesPageLayout>
  );
}

export default function ArticleListPageWrapper() {
  return (
    <Suspense fallback={<div />}>
      <ArticleListPage />
    </Suspense>
  );
}
