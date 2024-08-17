import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import LoadingSpinner from 'components/common/LoadingSpinner';
import HotArticles from 'pages/Notice/components/HotArticle';
import styles from './NoticePage.module.scss';

export default function Notice() {
  useScrollToTop();

  return (
    <div className={styles.template}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.header__title}>공지사항</h1>
        </div>
        <Suspense fallback={<LoadingSpinner size="200px" />}>
          <Outlet />
        </Suspense>
      </div>
      <Suspense fallback={<LoadingSpinner size="80px" />}>
        <HotArticles />
      </Suspense>
    </div>
  );
}
