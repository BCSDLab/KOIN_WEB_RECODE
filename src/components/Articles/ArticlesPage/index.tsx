import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { cn } from '@bcsdlab/utils';
import SearchIcon from 'assets/svg/Articles/search.svg';
import HotArticles from 'components/Articles/components/HotArticle';
import LostItemRouteButton from 'components/Articles/components/LostItemRouteButton';
import ROUTES from 'static/routes';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import styles from './ArticlesPage.module.scss';

export default function ArticlesPageLayout({ children }: { children: React.ReactNode }) {
  useScrollToTop();

  const router = useRouter();

  const currentPath = router.pathname;
  const headerTitle = currentPath === '/lost-item' ? '분실물' : '공지사항';
  const isLostItem = currentPath === '/lost-item';

  const keywordFromQuery = (Array.isArray(router.query.keyword) ? router.query.keyword[0] : router.query.keyword) ?? '';
  const [keyword, setKeyword] = useState(String(keywordFromQuery));

  const applySearch = () => {
    const next = keyword.trim();

    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        keyword: next || undefined,
        page: 1,
      },
    });
  };

  return (
    <div className={cn({ [styles.template]: !isLostItem, [styles['lostItem-template']]: isLostItem })}>
      <div className={cn({ [styles.content]: !isLostItem, [styles['lostItem-content']]: isLostItem })}>
        <div className={styles.header}>
          <Link href={ROUTES.Articles()}>
            <h1 className={styles.header__title}>{headerTitle}</h1>
          </Link>
        </div>

        <div className={styles.header__container}>
          {isLostItem && (
            <div className={styles.search}>
              <SearchIcon className={styles.search__icon} />
              <input
                className={styles.search__input}
                value={keyword}
                maxLength={100}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="검색어를 입력해주세요."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') applySearch();
                }}
              />
            </div>
          )}

          {isLostItem && (
            <div className={styles.header__rightButton}>
              <LostItemRouteButton />
            </div>
          )}
        </div>
        {children}
      </div>
      <div className={styles.aside}>
        <HotArticles />
      </div>
    </div>
  );
}
