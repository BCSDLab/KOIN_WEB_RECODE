import Pagination from 'pages/Articles/components/Pagination';
import NoticeHeader from 'pages/Articles/components/NoticeHeader';
import NoticeList from 'pages/Articles/components/NoticeList';
import usePageParams from 'pages/Articles/hooks/usePageParams';
import useArticles from 'pages/Articles/hooks/useArticles';
import { Suspense } from 'react';

export default function ArticleListPage() {
  const paramsPage = usePageParams();
  const { articles, paginationInfo } = useArticles(paramsPage);

  return (
    <>
      <NoticeHeader />
      <Suspense fallback={<div />}>
        <NoticeList articles={articles} />
        <Pagination totalPageNum={articles === null ? 5 : paginationInfo.total_count} />
      </Suspense>
    </>
  );
}
