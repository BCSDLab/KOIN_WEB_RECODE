import React from 'react';
import MobileSearchIcon from 'assets/svg/mobile-store-search-icon.svg';
import { useStoreCategories } from 'pages/Store/StorePage/hooks/useCategoryList';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useParamsHandler from 'utils/hooks/routing/useParamsHandler';
import useLogger from 'utils/hooks/analytics/useLogger';
import styles from './SearchBar.module.scss';

export default function SearchBar() {
  const storeRef = React.useRef<HTMLInputElement | null>(null);
  const { data: categories } = useStoreCategories();
  const { params, searchParams, setParams } = useParamsHandler();
  const logger = useLogger();
  const isMobile = useMediaQuery();

  return (
    <div className={styles.search_bar}>
      <input
        ref={storeRef}
        className={styles.search_bar__input}
        defaultValue={
          searchParams.get('storeName') === undefined ? '' : searchParams.get('storeName') ?? ''
        }
        type="text"
        name="search"
        placeholder="상점명을 입력하세요"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setParams('storeName', e.currentTarget.value, {
              deleteBeforeParam: searchParams.get('storeName') === undefined,
              replacePage: true,
            });
          }
        }}
        onFocus={() => {
          const currentCategoryId = Number(params.category) - 1; // 검색창에 포커스되면 로깅
          if (categories) logger.actionEventClick({ actionTitle: 'BUSINESS', title: 'shop_categories_search', value: `search in ${categories.shop_categories[currentCategoryId]?.name || '전체보기'}` });
        }}
      />
      <button
        className={styles.search_bar__icon}
        type="button"
        onClick={() => {
          setParams('storeName', storeRef.current?.value ?? '', {
            deleteBeforeParam: searchParams.get('storeName') === undefined,
            replacePage: true,
          });
        }}
      >
        {
          isMobile ? (
            <div className={styles['search-icon']}>
              <MobileSearchIcon />
            </div>
          ) : (
            <img
              className={styles['search-icon']}
              src="https://static.koreatech.in/assets/img/search.png"
              alt="store_icon"
            />
          )
        }
      </button>
    </div>
  );
}
