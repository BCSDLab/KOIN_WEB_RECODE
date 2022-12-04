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

  if (params.totalPageNum === undefined && articleList !== 'loading') setParams('totalPageNum', String(articleList!.totalPage), false, true);

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
              <div className={styles['loading-container']}>
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
        {
          params.totalPageNum === undefined ? (
            <div className={styles['loading-container']}>
              <LoadingSpinner
                size="10px"
              />
            </div>
          ) : (
            <PageNation
              totalPageNum={Number(params.totalPageNum)}
            />
          )
        }
      </div>
      { hotArticleList }
    </div>
  );
}

export default NoticePage;
