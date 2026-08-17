import { ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@bcsdlab/utils';
import HotArticles from 'components/Articles/components/HotArticle';
import ROUTES from 'static/routes';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import styles from './ArticlesPage.module.scss';

interface ArticlesPageLayoutProps {
  children: ReactNode;
  mobileTabMenu?: ReactNode;
  isDetailPage?: boolean;
}

export default function ArticlesPageLayout({ children, mobileTabMenu, isDetailPage = false }: ArticlesPageLayoutProps) {
  useScrollToTop();

  const isMobile = useMediaQuery();

  return (
    <div className={cn({ [styles.template]: true, [styles['template--detail']]: isDetailPage })}>
      <div className={styles.content}>
        {!isMobile && (
          <div className={styles.header}>
            <Link href={ROUTES.Articles()}>
              <h1 className={styles.header__title}>게시판</h1>
            </Link>
          </div>
        )}
        {mobileTabMenu}
        <div className={styles.listScroll}>{children}</div>
      </div>
      <div className={styles.aside}>
        <HotArticles />
      </div>
    </div>
  );
}
