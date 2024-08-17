import Pagination from 'pages/Notice/components/Pagination';
import NoticeHeader from 'pages/Notice/components/NoticeHeader';
import NoticeList from 'pages/Notice/components/NoticeList';
import usePageParams from 'pages/Notice/hooks/usePageParams';
import useArticles from 'pages/Notice/hooks/useArticles';

export default function NoticeListPage() {
  const paramsPage = usePageParams();
  const { articles, pageData } = useArticles(paramsPage);

  if (!articles) return <div>Loading...</div>;

  return (
    <>
      <NoticeHeader />
      <NoticeList
        articles={articles}
      />
      <Pagination
        totalPageNum={articles === null ? 5 : pageData.total_count}
      />
    </>
  );
}
