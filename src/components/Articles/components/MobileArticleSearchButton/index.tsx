import { useRouter } from 'next/router';
import SearchIcon from 'assets/svg/search-01.svg';
import ROUTES from 'static/routes';
import styles from './MobileArticleSearchButton.module.scss';

export default function MobileArticleSearchButton() {
  const router = useRouter();

  return (
    <div className={styles.searchBar}>
      <button
        type="button"
        className={styles.searchBar__button}
        onClick={() => router.push(ROUTES.ArticlesSearch())}
        aria-label="공지사항 검색"
      >
        <SearchIcon />
      </button>
    </div>
  );
}
