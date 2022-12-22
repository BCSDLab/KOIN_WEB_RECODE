import Pagination from 'components/Post/Pagination';
import HotPost from 'components/Post/HotPost';
import PostHeader from 'components/Post/PostHeader';
import PostList from 'components/Post/PostList';
import LoadingSpinner from 'components/common/LoadingSpinner';
import usePageParams from 'pages/BoardPage/Notice/hooks/usePageParams';
import styles from './NoticePage.module.scss';

function NoticePage() {
  const articleList = usePageParams();

  return (
    <div className={styles.template}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.header__title}>공지사항</h1>
        </div>
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
      </div>
      <HotPost />
    </div>
  );
}

export default NoticePage;
