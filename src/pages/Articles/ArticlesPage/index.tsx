import LoadingSpinner from 'components/common/LoadingSpinner';
import HotArticles from 'pages/Articles/components/HotArticle';
import { useState, Suspense } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import { useUser } from 'utils/hooks/state/useUser';
import LostItemRouteButton from 'pages/Articles/components/LostItemRouteButton';
import ROUTES from 'static/routes';
import { useArticlesLogger } from 'pages/Articles/hooks/useArticlesLogger';
import styles from './ArticlesPage.module.scss';

export default function ArticlesPage() {
  useScrollToTop();
  const { pathname } = useLocation();
  const isBoard = pathname.endsWith(ROUTES.Articles());
  const { data: userInfo } = useUser();
  const isCouncil = userInfo && userInfo.student_number === '2022136000';

  const { logItemWriteClick } = useArticlesLogger();

  return (
    <div className={styles.template}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Link to={ROUTES.Articles()}>
            <h1 className={styles.header__title}>공지사항</h1>
          </Link>
          <div />

          <LostItemRouteButton />
          {/* isBoard && isCouncil && <LostItemRouteButton /> */}
        </div>
        <Suspense fallback={<LoadingSpinner size="150px" />}>
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
