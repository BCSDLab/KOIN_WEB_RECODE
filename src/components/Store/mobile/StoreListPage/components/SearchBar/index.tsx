import { useRouter } from 'next/router';

import SearchIconGray from 'assets/svg/store/search-icon-gray.svg';
import { getCategoryIdFromQuery, getCategoryNameById } from 'components/Store/mobile/common/utils/shopCategories';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';

import styles from './SearchBar.module.scss';

// KOIN_ORDER_WEBVIEW pages/Home/components/SearchBar 이전. 누르면 검색 화면으로 이동한다
export default function SearchBar() {
  const router = useRouter();
  const logger = useLogger();

  const handleSearchBarClick = () => {
    const categoryName = getCategoryNameById(getCategoryIdFromQuery(router.query.category));

    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_categories_search',
      value: `search in ${categoryName}`,
    });
    router.push(ROUTES.StoreSearch());
  };

  return (
    <button type="button" className={styles['search-bar']} onClick={handleSearchBarClick}>
      <SearchIconGray className={styles['search-bar__icon']} />
      <span className={styles['search-bar__placeholder']}>검색어를 입력해주세요.</span>
    </button>
  );
}
