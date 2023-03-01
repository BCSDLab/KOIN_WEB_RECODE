import Pagination from 'components/Post/Pagination';
import PostHeader from 'components/Post/PostHeader';
import PostList from 'components/Post/PostList';
import LoadingSpinner from 'components/common/LoadingSpinner';
import usePageParams from 'pages/Notice/NoticeListPage/hooks/usePageParams';
import useArticleList from 'pages/Notice/NoticeListPage/hooks/useArticleList';
import styles from './NoticeListPage.module.scss';

function NoticePage() {
  const paramsPage = usePageParams();
  const articleList = useArticleList(paramsPage);

  return (
    <>
      <PostHeader />
      <div>
        {
          articleList === null ? (
            <div className={styles['post-loading']}>
              <LoadingSpinner
                size="200px"
              />
            </div>
          ) : (
            <PostList
              articles={articleList?.articles}
            />
          )
        }
      </div>
      <Pagination
        totalPageNum={articleList === null ? 5 : articleList!.totalPage}
      />
    </>
  );
}

export default NoticePage;
