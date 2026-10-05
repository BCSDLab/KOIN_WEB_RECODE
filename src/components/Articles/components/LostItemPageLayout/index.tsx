import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import SearchIcon from 'assets/svg/Articles/search.svg';
import HotArticles from 'components/Articles/components/HotArticle';
import LostItemRouteButton from 'components/Articles/components/LostItemRouteButton';
import ROUTES from 'static/routes';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import styles from './LostItemPageLayout.module.scss';

export default function LostItemPageLayout({ children }: { children: React.ReactNode }) {
  useScrollToTop();

  const router = useRouter();

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
    <div className={styles['lostItem-template']}>
      <div className={styles['lostItem-content']}>
        <div className={styles.header}>
          <Link href={ROUTES.LostItems()}>
            <h1 className={styles.header__title}>분실물</h1>
          </Link>
        </div>

        <div className={styles.index}>
          <div className={styles['search-container']}>
            <SearchIcon />
            <input
              className={styles['search-container__input']}
              value={keyword}
              maxLength={100}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="검색어를 입력해주세요."
              onKeyDown={(e) => {
                if (e.key === 'Enter') applySearch();
              }}
            />
          </div>

          <div className={styles.index__rightButton}>
            <LostItemRouteButton />
          </div>
        </div>

        <div className={styles.listScroll}>{children}</div>
      </div>

      <div className={styles.aside}>
        <HotArticles />
      </div>
    </div>
  );
}
