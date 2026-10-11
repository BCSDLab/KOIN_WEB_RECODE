import Link from 'next/link';
import { useRouter } from 'next/router';

import MenuIcon from 'assets/svg/Store/search-menu-icon.svg';
import NavigateStoreIcon from 'assets/svg/Store/search-navigate-icon.svg';
import StoresIcon from 'assets/svg/Store/search-stores-icon.svg';
import { getLoggingTime } from 'components/Store/mobile/common/utils/loggingTime';
import { getCategoryIdFromQuery, getCategoryNameById } from 'components/Store/mobile/common/utils/shopCategories';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';

import styles from './RelateSearchItem.module.scss';

interface RelateSearchItemProps {
  tag: 'store' | 'menu';
  shopId: number;
  shopName: string;
  menuName?: string;
}

// KOIN_ORDER_WEBVIEW pages/Search/components/RelateSearchItem 이전. 누르면 상점 상세로 이동한다
export default function RelateSearchItem({ tag, shopId, shopName, menuName }: RelateSearchItemProps) {
  const router = useRouter();
  const logger = useLogger();

  const handleSearchItemClick = () => {
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_categories_search_click',
      value: shopName,
      duration_time: getLoggingTime('selectedCategoryTime'),
      previous_page: getCategoryNameById(getCategoryIdFromQuery(router.query.category)),
      current_page: shopName,
    });
  };

  return (
    <Link
      href={ROUTES.StoreDetail({ id: String(shopId) })}
      className={styles.item}
      onClick={handleSearchItemClick}
    >
      <div className={styles.item__content}>
        {tag === 'store' ? (
          <StoresIcon className={styles.item__icon} />
        ) : (
          <MenuIcon className={styles.item__icon} />
        )}
        <p className={styles.item__text}>
          {menuName && `${menuName} | `}
          {shopName}
        </p>
      </div>
      <NavigateStoreIcon className={styles.item__icon} />
    </Link>
  );
}
