import Link from 'next/link';
import HotArticles from 'components/Articles/components/HotArticle';
import LostItemRouteButton from 'components/Articles/components/LostItemRouteButton';
import ROUTES from 'static/routes';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
// import { useUser } from 'utils/hooks/state/useUser';
// import { useArticlesLogger } from 'pages/Articles/hooks/useArticlesLogger';
import styles from './ArticlesPage.module.scss';

export default function ArticlesPageLayout({ children }: { children: React.ReactNode }) {
  useScrollToTop();
  // const { pathname } = useLocation();
  // const isBoard = pathname.endsWith(ROUTES.Articles());
  // const { data: userInfo } = useUser();
  // const isCouncil = userInfo && userInfo.student_number === '2022136000';

  // const { logItemWriteClick } = useArticlesLogger();

  return (
    <div className={styles.template}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Link href={ROUTES.Articles()}>
            <h1 className={styles.header__title}>공지사항</h1>
          </Link>
          <div />
          <LostItemRouteButton />
          {/* isBoard && isCouncil && <LostItemRouteButton /> */}
        </div>
        {children}
      </div>
      <div className={styles.aside}>
        <HotArticles />
      </div>
    </div>
  );
}
