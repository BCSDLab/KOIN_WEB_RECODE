import LoadingSpinner from 'components/common/LoadingSpinner';
import HotArticles from 'pages/Notice/components/HotArticle';
import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import { useUser } from 'utils/hooks/state/useUser';
import LostItemRouteButton from 'pages/Notice/components/LostItemRouteButton';
import styles from './NoticePage.module.scss';

export default function NoticePage() {
  // const [linksOpen, ,, toggleLinksOpen] = useBooleanState(false);
  useScrollToTop();
  const { pathname } = useLocation();
  const isBoard = pathname.includes('board');
  const { data: userInfo } = useUser();
  const isCouncil = userInfo && userInfo.student_number === '2022136000';

  return (
    <div className={styles.template}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.header__title}>공지사항</h1>
          {isBoard && isCouncil && <LostItemRouteButton />}
        </div>
        <Suspense fallback={<LoadingSpinner size="200px" />}>
          <Outlet />
        </Suspense>
      </div>
      <div className={styles.aside}>
        <Suspense fallback={<LoadingSpinner size="80px" />}>
          <HotArticles />
        </Suspense>
      </div>
    </div>
  );
}
