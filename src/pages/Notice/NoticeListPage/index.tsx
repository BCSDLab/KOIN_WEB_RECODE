import Pagination from 'pages/Notice/components/Pagination';
import NoticeHeader from 'pages/Notice/components/NoticeHeader';
import NoticeList from 'pages/Notice/components/NoticeList';
import usePageParams from 'pages/Notice/hooks/usePageParams';
import useArticles from 'pages/Notice/hooks/useArticles';
import { Suspense } from 'react';

export default function NoticeListPage() {
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
