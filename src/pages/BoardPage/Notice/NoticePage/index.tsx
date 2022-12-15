import React from 'react';
import Pagination from 'components/Post/Pagination';
import HotPost from 'components/Post/HotPost';
import PostHeader from 'components/Post/PostHeader';
import PostList from 'components/Post/PostList';
import LoadingSpinner from 'components/common/LoadingSpinner';
import useArticleList from 'pages/BoardPage/Notice/hooks/useArticleList';
import useParamsHandler from 'utils/hooks/useParamsHandler';
import styles from './NoticePage.module.scss';

function NoticePage() {
  const { params, setParams } = useParamsHandler();
  const articleList = useArticleList(params.boardId ?? '1');

  React.useEffect(() => {
    if (params.totalPageNum === undefined && articleList !== null) setParams('totalPageNum', String(articleList!.totalPage), false, true);
    if (params.boardId === undefined) setParams('boardId', '1', false, true);
  }, [params, setParams, articleList]);

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
