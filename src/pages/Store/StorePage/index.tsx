import React, { useEffect, useRef, useState } from 'react';
import { StoreSorterType, StoreFilterType } from 'api/store/entity';
import * as api from 'api';
import { cn } from '@bcsdlab/utils';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useLogger from 'utils/hooks/analytics/useLogger';
import Close from 'assets/svg/close-icon-20x20.svg';
import useParamsHandler from 'utils/hooks/routing/useParamsHandler';
import { useQuery } from '@tanstack/react-query';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import { useScrollLogging } from 'utils/hooks/analytics/useScrollLogging';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import SearchBar from 'pages/Store/StorePage/components/SearchBar';
import DesktopStoreList from 'pages/Store/StorePage/components/DesktopStoreList';
import MobileStoreList from 'pages/Store/StorePage/components/MobileStoreList';
import { STORE_PAGE } from 'static/store';
import IntroToolTip from 'components/common/IntroToolTip';
import AscSelectArrow from 'assets/svg/store-filter-arrow-asc-select.svg';
import DescSelectArrow from 'assets/svg/store-filter-arrow-desc-select.svg';
import DescArrow from 'assets/svg/store-filter-arrow-desc.svg';
import styles from './StorePage.module.scss';
import { useStoreCategories } from './hooks/useCategoryList';
import EventCarousel from './components/EventCarousel';

type StoreSearchQueryType = {
  storeName?: string;
  category?: string;
  delivery?: string;
  bank?: string;
  card?: string;
  shopIds?: string;
};

interface StoreMobileState {
  sorter: StoreSorterType | '';
  filter: StoreFilterType[];
  storeName?: string;
}

interface MobileCheckBoxItem {
  id: StoreSorterType | StoreFilterType;
  content: string;
  value: number;
}

const MOBILE_CHECK_BOX: MobileCheckBoxItem[] = [
  {
    id: 'COUNT',
    content: '리뷰순',
    value: 1,
  },
  {
    id: 'RATING',
    content: '별점순',
    value: 2,
  },
  {
    id: 'OPEN',
    content: '영업중',
    value: 3,
  },
  {
    id: 'DELIVERY',
    content: '배달 가능',
    value: 4,
  },
];

const toggleNameLabel = {
  COUNT: 'review',
  RATING: 'star',
  OPEN: 'open',
  DELIVERY: 'delivery',
} as const;

const loggingCategoryToggleValue = (
  toggleName: 'COUNT' | 'RATING' | 'OPEN' | 'DELIVERY',
  category: string | undefined,
) => `check_${toggleNameLabel[toggleName]}_${category || '전체보기'}`;

const useStoreList = (
  sorter: StoreSorterType,
  filter: StoreFilterType[],
  params: StoreSearchQueryType,
) => {
  const { data: storeList } = useQuery(
    {
      queryKey: ['storeListV2', sorter, filter],
      queryFn: () => api.store.getStoreListV2(
        sorter,
        filter,
        params.storeName,
      ),
      retry: 0,
    },
  );

  const selectedCategory = Number(params.category);

  return storeList?.shops.filter((store) => {
    const matchCategory = params.category === undefined
      || store.category_ids.some((id) => id === selectedCategory);

    if (!params.shopIds && params.storeName) return store.name.includes(params.storeName ? params.storeName : '');
    // 메뉴검색시 메뉴를 가진 가게를 반환
    if (params.shopIds) {
      const shopIdsArr = params.shopIds.split(',').map(Number);
      return shopIdsArr.includes(store.id);
    }
    return (
      matchCategory
      && store.name.includes(params.storeName ? params.storeName : '')
    );
  });
};

function StorePage() {
  const [storeMobileFilterState, setStoreMobileFilterState] = React.useState<StoreMobileState>({
    sorter: '',
    filter: [],
  });
  const [isToolTipOpen, setIsToolTipOpen] = React.useState(true);
  const { params, searchParams, setParams } = useParamsHandler();
  const storeList = useStoreList(
    storeMobileFilterState.sorter,
    storeMobileFilterState.filter,
    params,
  );
  const isMobile = useMediaQuery();
  const { data: categories } = useStoreCategories();
  const logger = useLogger();
  const selectedCategory = Number(searchParams.get('category')) ?? -1;
  const [isTooltipOpen, , closeTooltip] = useBooleanState(localStorage.getItem('store-review-tooltip') === null);
  const handleTooltipCloseButtonClick = () => {
    localStorage.setItem('store-review-tooltip', 'used');
    closeTooltip();
  };
  const [filterSortingState, setFilterSortingState] = useState({
    COUNT: false,
    RATING: false,
  });

  const koreanCategory = selectedCategory === -1
    ? '전체보기'
    : categories?.shop_categories.find(
      (category) => category.id === selectedCategory,
    )?.name || '전체보기';

  const loggingCheckbox = (id: string, isChecked: boolean) => {
    if (isChecked) {
      logger.actionEventClick({
        actionTitle: 'BUSINESS',
        title: 'shop_can',
        value: `check_${id}_${koreanCategory}`,
      });
    }
  };
  const onClickMobileStoreListFilter = (
    item: StoreSorterType | StoreFilterType,
  ) => {
    if (item === 'COUNT' || item === 'RATING') {
      setStoreMobileFilterState((prevState) => ({
        ...prevState,
        sorter: item,
      }));
      setFilterSortingState((preFilterSortingState) => ({
        COUNT: item === 'COUNT' ? !preFilterSortingState.COUNT : false,
        RATING: item === 'RATING' ? !preFilterSortingState.RATING : false,
      }));

      if (storeMobileFilterState.sorter !== item) {
        logger.actionEventClick({
          actionTitle: 'BUSINESS',
          title: 'shop_can',
          value: loggingCategoryToggleValue(
            item,
            categories?.shop_categories[selectedCategory]?.name,
          ),
          event_category: 'click',
        });
      }
    } else if (item === 'DELIVERY' || item === 'OPEN') {
      setStoreMobileFilterState((prevState) => {
        const newFilter = prevState.filter.includes(item)
          ? prevState.filter.filter((filterItem) => filterItem !== item)
          : [...prevState.filter, item];
        return {
          ...prevState,
          filter: newFilter,
        };
      });
      // 현재상태와 바뀔 상태를 비교해서 토글이 on 되는지 판단함
      if (!storeMobileFilterState.filter.includes(item)) {
        logger.actionEventClick({
          actionTitle: 'BUSINESS',
          title: 'shop_can',
          value: loggingCategoryToggleValue(
            item,
            categories?.shop_categories[selectedCategory]?.name,
          ),
          event_category: 'click',
        });
      }
    }
  };

  useScrollToTop();
  const storeScrollLogging = () => {
    const currentCategoryId = searchParams.get('category') === undefined
      ? 0
      : Number(searchParams.get('category')) - 1;
    logger.actionEventClick({
      actionTitle: 'BUSINESS',
      title: 'shop_categories',
      value: `scroll in ${
        categories?.shop_categories[currentCategoryId]?.name || '전체보기'
      }`,
      event_category: 'scroll',
    });
  };

  useScrollLogging(storeScrollLogging);

  const enterCategoryTimeRef = useRef<number | null>(null);
  const handleIcon = (item: MobileCheckBoxItem) => {
    if (item.id === 'COUNT' || item.id === 'RATING') {
      const isSelected = storeMobileFilterState.sorter === item.id;

      if (isSelected) {
        return filterSortingState[item.id] ? <DescSelectArrow /> : <AscSelectArrow />;
      }

      return <DescArrow />;
    }
    return null;
  };
  useEffect(() => {
    if (enterCategoryTimeRef.current === null) {
      const currentTime = new Date().getTime();
      sessionStorage.setItem('enter_category', currentTime.toString());
      enterCategoryTimeRef.current = currentTime;
    }
    if (sessionStorage.getItem('pushStateCalled')) {
      sessionStorage.removeItem('pushStateCalled');
    }
    sessionStorage.setItem(
      'cameFrom',
      categories?.shop_categories[selectedCategory]?.name || '전체보기',
    );
  }, [categories, selectedCategory]);

  return (
    <div className={styles.section}>
      <div className={styles.header}>주변 상점</div>
      {isMobile && <SearchBar />}
      <div className={styles.category}>
        <div className={styles.category__header}>CATEGORY</div>
        <div className={styles.category__wrapper}>
          {categories?.shop_categories.slice(isMobile ? 1 : 0, 12).map((category) => (
            <button
              className={cn({
                [styles.category__menu]: true,
                [styles['category__menu--selected']]:
                  category.id === selectedCategory,
                [styles['category__menu--disabled']]:
                  category.id === 1 && isMobile,
              })}
              role="radio"
              aria-checked={category.id === selectedCategory}
              type="button"
              onClick={() => {
                logger.actionEventClick({
                  actionTitle: 'BUSINESS',
                  title: 'shop_categories',
                  value: category.name,
                  event_category: 'click',
                  previous_page:
                    categories?.shop_categories.find(
                      (item) => item.id === Number(searchParams.get('category')),
                    )?.name || '전체보기',
                  duration_time:
                    (new Date().getTime()
                      - Number(sessionStorage.getItem('enter_category')))
                    / 1000,
                  current_page: category.name,
                });
                sessionStorage.setItem(
                  'enter_category',
                  new Date().getTime().toString(),
                );

                setParams('category', `${category.id} `, {
                  deleteBeforeParam: false,
                  replacePage: true,
                });
              }}
              key={category.id}
            >
              <img
                className={styles.category__image}
                src={category.image_url}
                alt="category_img"
              />
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>
      {!isMobile && <SearchBar />}
      <div className={styles.option}>
        <div className={styles.option__count}>
          총
          <strong>
            {storeList?.length}
            개의 업체가
          </strong>
          있습니다.
        </div>
        <div className={styles.option__checkbox}>
          {MOBILE_CHECK_BOX.map((item, index) => (
            <div
              key={item.id}
              className={cn({
                [styles['option-checkbox']]: true,
                [styles['option-checkbox--last']]: index === MOBILE_CHECK_BOX.length - 1,
              })}
            >
              <label htmlFor={item.id} className={styles['option-checkbox__label']}>
                <input
                  id={item.id}
                  type="checkbox"
                  checked={!!searchParams.get(item.id)}
                  className={styles['option-checkbox__input']}
                  onChange={() => {
                    loggingCheckbox(item.id, !searchParams.get(item.id));
                    setParams(item.id, String(item.value), {
                      deleteBeforeParam: true,
                      replacePage: true,
                    });
                  }}
                />
                {item.content}
              </label>
            </div>
          ))}
          {
            isTooltipOpen && (
            <div className={styles.tooltip}>
              <div className={styles.tooltip__content}>
                지금 리뷰가 가장 많은 상점을 확인해보세요!
              </div>
              <button type="button" aria-label="리뷰 툴팁 닫기" className={styles.tooltip__close} onClick={handleTooltipCloseButtonClick}>
                <Close />
              </button>
            </div>
            )
          }
        </div>
      </div>
      {isMobile && (
        <div className={styles['store-mobile-header']}>상점목록</div>
      )}
      <EventCarousel />
      <div className={styles.filter}>
        {MOBILE_CHECK_BOX.map((item) => (
          <button
            className={cn({
              [styles.filter__box]: true,
              [styles['filter__box--activate']]:
                storeMobileFilterState.sorter.includes(item.id)
                || storeMobileFilterState.filter.includes(
                  item.id as StoreFilterType,
                ),
            })}
            key={item.value}
            type="button"
            onClick={() => onClickMobileStoreListFilter(item.id)}
          >
            {handleIcon(item)}
            {item.content}
          </button>
        ))}
        {isToolTipOpen && (
          <IntroToolTip
            content="지금 리뷰가 가장 많은 상점을 확인해보세요!"
            setCloseState={setIsToolTipOpen}
          />
        )}
      </div>
      {!isMobile ? (
        <DesktopStoreList
          storeListData={filterSortingState.COUNT || filterSortingState.RATING
            ? storeList : storeList?.reverse()}
          storeType={STORE_PAGE.MAIN}
        />
      ) : (
        <MobileStoreList
          storeListData={filterSortingState.COUNT || filterSortingState.RATING
            ? storeList : storeList?.reverse()}
          storeType={STORE_PAGE.MAIN}
        />
      )}
    </div>
  );
}

export default StorePage;
