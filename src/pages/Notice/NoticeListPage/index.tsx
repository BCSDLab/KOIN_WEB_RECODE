import Pagination from 'components/Post/Pagination';
import PostHeader from 'components/Post/PostHeader';
import PostList from 'components/Post/PostList';
import usePageParams from 'pages/Notice/NoticeListPage/hooks/usePageParams';
import useArticleList from 'pages/Notice/NoticeListPage/hooks/useArticleList';

function NoticePage() {
  const paramsPage = usePageParams();
  const articleList = useArticleList(paramsPage);
  return (
    <>
      <PostHeader />
      <PostList
        articles={articleList.articles}
      />
      <Pagination
        totalPageNum={articleList === null ? 5 : articleList!.total_page}
      />
    </>
  );
}

export default NoticePage;
