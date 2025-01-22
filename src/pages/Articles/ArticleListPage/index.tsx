import Pagination from 'pages/Articles/components/Pagination';
import ArticlesHeader from 'pages/Articles/components/ArticlesHeader';
import ArticleList from 'pages/Articles/components/ArticleList';
import usePageParams from 'pages/Articles/hooks/usePageParams';
import useArticles from 'pages/Articles/hooks/useArticles';
import { Suspense } from 'react';

export default function ArticleListPage() {
  const paramsPage = usePageParams();
  const { articles, paginationInfo } = useArticles(paramsPage);

  return (
    <>
      <ArticlesHeader />
      <Suspense fallback={<div />}>
        <ArticleList articles={articles} />
        <Pagination totalPageNum={articles === null ? 5 : paginationInfo.total_count} />
      </Suspense>
    </>
  );
}
