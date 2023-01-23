import { Suspense } from 'react';
import useHotArticleList from 'pages/BoardPage/Notice/hooks/useHotArticle';
import { ReactComponent as LoadingSpinner } from 'assets/svg/loading-spinner.svg';
import { Outlet } from 'react-router-dom';
import styles from './Notice.module.scss';

function Notice() {
  const hotArticleList = useHotArticleList();
  return (
    <div className={styles.template}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.header__title}>공지사항</h1>
        </div>
        <Suspense fallback={<LoadingSpinner className={styles['content__loading-spinner']} />}>
          <Outlet />
        </Suspense>
      </div>
      { hotArticleList }
    </div>
  );
}

export default Notice;
