import Link from 'next/link';
import HotArticles from 'components/Articles/components/HotArticle';
import ROUTES from 'static/routes';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import styles from './ArticlesPage.module.scss';

export default function ArticlesPageLayout({ children }: { children: React.ReactNode }) {
  useScrollToTop();

  const isMobile = useMediaQuery();

  return (
    <div className={styles.template}>
      <div className={styles.content}>
        {!isMobile && (
          <div className={styles.header}>
            <Link href={ROUTES.Articles()}>
              <h1 className={styles.header__title}>공지사항</h1>
            </Link>
          </div>
        )}
        <div className={styles.listScroll}>{children}</div>
      </div>
      <div className={styles.aside}>
        <HotArticles />
      </div>
    </div>
  );
}
