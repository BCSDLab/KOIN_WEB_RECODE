import { useQuery } from '@tanstack/react-query';
import { storeMobileQueries } from 'api/storeMobile/queries';
import RelateSearchItem from 'components/Store/mobile/StoreSearchPage/components/RelateSearchItem';

import styles from './SearchResultList.module.scss';

interface SearchResultListProps {
  keyword: string;
}

// KOIN_ORDER_WEBVIEW pages/Search/components/SearchResultList 이전. 상점 결과 다음에 메뉴 결과를 잇는다
export default function SearchResultList({ keyword }: SearchResultListProps) {
  const { data } = useQuery(storeMobileQueries.relatedSearch(keyword));

  if (!data) return null;

  const { shop_name_search_results: shops, menu_name_search_results: menus } = data;

  return (
    <div className={styles.list}>
      {shops?.map(({ shop_name, shop_id }) => (
        <RelateSearchItem key={`shop-${shop_id}`} tag="store" shopId={shop_id} shopName={shop_name} />
      ))}
      {menus?.map(({ menu_name, shop_name, shop_id }) => (
        <RelateSearchItem
          key={`menu-${shop_id}-${menu_name}`}
          tag="menu"
          shopId={shop_id}
          shopName={shop_name}
          menuName={menu_name}
        />
      ))}
    </div>
  );
}
