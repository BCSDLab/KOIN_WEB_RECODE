import React from 'react';
import PageNation from 'components/Post/PageNation';
import HotPost from 'components/Post/HotPost';
import PostHeader from 'components/Post/PostHeader';
import PostList from 'components/Post/PostList';
import LoadingSpinner from 'components/common/LoadingSpinner';
import useArticleList from 'pages/Notice/hooks/useArticleList';
import useParamsHandler from 'utils/hooks/useParamsHandler';
import styles from './NoticePage.module.scss';

function NoticePage() {
  const { params, setParams } = useParamsHandler();
  const articleList = useArticleList(params.boardId === undefined ? '1' : params.boardId);
  const hotArticleList = HotPost();

  React.useEffect(() => {
    if (params.totalPageNum === undefined && articleList !== 'loading') setParams('totalPageNum', String(articleList!.totalPage), false, true);
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
            articleList === 'loading' ? (
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
        <PageNation
          totalPageNum={articleList === 'loading' ? 5 : articleList!.totalPage}
        />
      </div>
      { hotArticleList }
    </div>
  );
}

export default NoticePage;
