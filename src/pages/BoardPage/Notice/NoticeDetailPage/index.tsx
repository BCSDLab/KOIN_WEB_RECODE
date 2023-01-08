import { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { ReactComponent as LoadingSpinner } from 'assets/svg/loading-spinner.svg';
import PostDetailHeader from 'components/Post/PostDetail/PostDetailHeader';
import PostDetailContent from 'components/Post/PostDetail/PostDetailContent';
import useHotArticleList from 'pages/BoardPage/Notice/hooks/useHotPost';
// import useNoticeDetail from './hooks/useNoticeDetail';
import styles from './NoticeDetailPage.module.scss';

function NoticeDetailPage() {
  const params = useParams();
  //   const noticeDetail = useNoticeDetail();
  const hotArticleList = useHotArticleList();
  //   console.log(noticeDetail);
  console.log(params.page);
  return (
    <div className={styles.template}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.header__title}>공지사항</div>
        </div>
        <Suspense fallback={<LoadingSpinner className={styles['content__loading-spinner']} />}>
          <PostDetailHeader />
          <PostDetailContent />
        </Suspense>
      </div>
      { hotArticleList }
    </div>
  );
}

export default NoticeDetailPage;
