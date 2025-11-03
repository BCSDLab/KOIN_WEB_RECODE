import { useState, useEffect, useRef } from 'react';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { cn } from '@bcsdlab/utils';
import { dehydrate, HydrationBoundary, QueryClient, useQuery } from '@tanstack/react-query';

import * as api from 'api';

import { getStoreCategories } from 'api/store';
import Close from 'assets/svg/close-icon-20x20.svg';
import DesktopStoreList from 'components/Store/StorePage/components/DesktopStoreList';
import EventCarousel from 'components/Store/StorePage/components/EventCarousel';
import MobileStoreList from 'components/Store/StorePage/components/MobileStoreList';
import SearchBar from 'components/Store/StorePage/components/SearchBar';
import SearchBarModal from 'components/Store/StorePage/components/SearchBarModal';
import { useStoreCategories } from 'components/Store/StorePage/hooks/useCategoryList';
import { getCategoryDurationTime, initializeCategoryEntryTime } from 'components/Store/utils/durationTime';
import IntroToolTip from 'components/ui/IntroToolTip';
import ROUTES from 'static/routes';
import { STORE_PAGE } from 'static/store';
import useLogger from 'utils/hooks/analytics/useLogger';
import { useScrollLogging } from 'utils/hooks/analytics/useScrollLogging';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useBooleanState from 'utils/hooks/state/useBooleanState';

import { useLocalStorage } from 'utils/hooks/state/useLocalStorage';
import useMount from 'utils/hooks/state/useMount';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import type { StoreSorterType, StoreFilterType } from 'api/store/entity';
import styles from './StorePage.module.scss';

type StoreSearchQueryType = {
  storeName?: string;
  category?: string;
  delivery?: string;
  bank?: string;
  card?: string;
  shopIds?: string;
};

const MOBILE_SORT_CHECK_BOX = [
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
] as const;

const MOBILE_FILTER_CHECK_BOX = [
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
] as const;

const toggleNameLabel = {
  COUNT: 'review',
  RATING: 'star',
  OPEN: 'open',
  DELIVERY: 'delivery',
} as const;

const CATEGORY_IS_UNDEFINED = -1;

const loggingCategoryToggleSorterValue = (toggleName: 'COUNT' | 'RATING', category: string | undefined) =>
  `check_${toggleNameLabel[toggleName]}_${category || '전체보기'}`;

const loggingCategoryToggleFilterValue = (toggleName: 'OPEN' | 'DELIVERY', category: string | undefined) =>
  `check_${toggleNameLabel[toggleName]}_${category || '전체보기'}`;

const useStoreList = (sorter: StoreSorterType, filter: StoreFilterType[], params: StoreSearchQueryType) => {
  const selectedCategory = Number(params.category);

  const { data: storeList } = useQuery({
    queryKey: ['storeListV2', sorter, filter, selectedCategory],
    queryFn: () => api.store.getStoreListV2(sorter, filter, params.storeName),
    placeholderData: (previousData) => previousData,
    select: (data) => {
      if (!data || !data.shops) return [];

      if (params.category === undefined) {
        return data.shops;
      }

      return data.shops.filter((store) => store.category_ids.some((id) => id === selectedCategory));
    },
  });

  return storeList || [];
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = new QueryClient();

  const { category, storeName } = context.query;

  const selectedCategory = category ? Number(category) : CATEGORY_IS_UNDEFINED;
  const selectedStoreName = storeName ? String(storeName) : undefined;

  await queryClient.prefetchQuery({
    queryKey: ['storeCategories'],
    queryFn: getStoreCategories,
  });

  await queryClient.prefetchQuery({
    queryKey: ['storeListV2', 'NONE', [], selectedCategory],
    queryFn: () => api.store.getStoreListV2('NONE', [], selectedStoreName),
  });

  await queryClient.prefetchQuery({
    queryKey: ['all-event'],
    queryFn: () => api.store.getAllEvent(),
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

function Store() {
  const enterCategoryTimeRef = useRef<number | null>(null);
  const [storeSorter, setStoreSorter] = useState<StoreSorterType>('NONE');
  const [storeFilterList, setStoreFilterList] = useState<{ [key in StoreFilterType]: boolean }>({
    OPEN: false,
    DELIVERY: false,
  });
  const router = useRouter();
  const logger = useLogger();
  const isMobile = useMediaQuery();
  const [localStorageValue] = useLocalStorage('store-review-tooltip', null);
  const [isTooltipOpen, , closeTooltip] = useBooleanState(localStorageValue === null);
  const isMounted = useMount();

  const filteredTypeList = Object.entries(storeFilterList)
    .filter(([, value]) => value)
    .map(([key]) => key as StoreFilterType);
  const { data: categories } = useStoreCategories();
  const storeList = useStoreList(storeSorter, filteredTypeList, router.query);

  const selectedCategory = router.query.category ? Number(router.query.category) : -1;

  const handleTooltipCloseButtonClick = () => {
    localStorage.setItem('store-review-tooltip', 'used');
    closeTooltip();
  };

  const handleCategoryClick = (categoryId: number) => {
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_categories',
      value: categoryId.toString(),
      previous_page: categories.shop_categories.find((item) => item.id === selectedCategory)?.name || '전체보기',
      duration_time: getCategoryDurationTime(),
      current_page: categoryId.toString(),
    });

    initializeCategoryEntryTime();

    router.push({
      pathname: ROUTES.Store(),
      query: { ...router.query, category: categoryId },
    });
  };

  const handleSortCheckBox = (type: StoreSorterType) => () => {
    setStoreSorter((prevSorter) => (prevSorter === type ? 'NONE' : type));

    if (type === 'COUNT' || type === 'RATING') {
      logger.actionEventClick({
        team: 'BUSINESS',
        event_label: 'shop_can',
        value: loggingCategoryToggleSorterValue(type, categories.shop_categories[selectedCategory]?.name),
      });
    }
  };

  const handleFilterCheckBox = (type: StoreFilterType) => () => {
    setStoreFilterList((prevFilterList) => ({ ...prevFilterList, [type]: !prevFilterList[type] }));

    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_can',
      value: loggingCategoryToggleFilterValue(type, categories.shop_categories[selectedCategory]?.name),
    });
  };

  const storeScrollLogging = () => {
    const currentCategoryId = selectedCategory;

    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_categories',
      value: `scroll in ${categories.shop_categories[currentCategoryId]?.name || '전체보기'}`,
      event_category: 'scroll',
    });
  };

  useScrollToTop();
  useScrollLogging(storeScrollLogging);
  useEffect(() => {
    if (enterCategoryTimeRef.current === null) {
      const currentTime = new Date().getTime();
      initializeCategoryEntryTime();
      enterCategoryTimeRef.current = currentTime;
    }
    sessionStorage.setItem('cameFrom', categories.shop_categories[selectedCategory]?.name || '전체보기');
  }, [categories, selectedCategory]);

  const handleBenefitClick = () => {
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_categories_benefit',
      value: '혜택이 있는 상점 모아보기',
      previous_page: categories.shop_categories.find((item) => item.id === selectedCategory)?.name || '전체보기',
      duration_time: getCategoryDurationTime(),
      current_page: 'benefit',
    });

    router.push(`${ROUTES.BenefitStore()}?category=1`);
  };

  return (
    <div className={styles.section}>
      <div className={styles.header}>주변 상점</div>
      {isMobile && <SearchBar />}
      <div className={styles.category}>
        <div className={styles.category__header}>CATEGORY</div>
        <div className={styles.category__wrapper}>
          {categories.shop_categories.slice(isMobile ? 1 : 0, 12).map((category) => (
            <button
              className={cn({
                [styles.category__menu]: true,
                [styles['category__menu--selected']]: category.id === selectedCategory,
                [styles['category__menu--disabled']]: category.id === 1 && isMobile,
              })}
              role="radio"
              aria-checked={category.id === selectedCategory}
              type="button"
              onClick={() => handleCategoryClick(category.id)}
              key={category.id}
            >
              <img className={styles.category__image} src={category.image_url} alt="category_img" />
              <span>{category.name}</span>
            </button>
          ))}
        </div>
        <button type="button" onClick={handleBenefitClick} className={styles.category__benefit}>
          혜택이 있는 상점 모아보기
        </button>
      </div>
      {!isMobile && <SearchBarModal onClose={() => {}} />}
      <div className={styles.option}>
        {router.query.storeName ? (
          <div className={styles.option__count}>
            <strong>{`"${router.query.storeName}" 관련 가게가 총 ${storeList.length}개 있습니다.`}</strong>
          </div>
        ) : (
          <div className={styles.option__count}>
            총
            <strong>
              {storeList.length}
              개의 업체가
            </strong>
            있습니다.
          </div>
        )}

        <div className={styles.option__checkbox}>
          {MOBILE_SORT_CHECK_BOX.map(({ id, content }) => (
            <div key={id} className={styles['option-checkbox']}>
              <label htmlFor={id} className={styles['option-checkbox__label']}>
                <input
                  id={id}
                  type="checkbox"
                  checked={storeSorter === id}
                  className={styles['option-checkbox__input']}
                  onChange={handleSortCheckBox(id)}
                />
                {content}
              </label>
            </div>
          ))}
          {MOBILE_FILTER_CHECK_BOX.map(({ id, content }) => (
            <div key={id} className={styles['option-checkbox']}>
              <label htmlFor={id} className={styles['option-checkbox__label']}>
                <input
                  id={id}
                  type="checkbox"
                  checked={storeFilterList[id]}
                  className={styles['option-checkbox__input']}
                  onChange={handleFilterCheckBox(id)}
                />
                {content}
              </label>
            </div>
          ))}
          {isMounted && isTooltipOpen && (
            <div className={styles.tooltip}>
              <div className={styles.tooltip__content}>지금 리뷰가 가장 많은 상점을 확인해보세요!</div>
              <button
                type="button"
                aria-label="리뷰 툴팁 닫기"
                className={styles.tooltip__close}
                onClick={handleTooltipCloseButtonClick}
              >
                <Close />
              </button>
            </div>
          )}
        </div>
      </div>
      {isMobile && <div className={styles['store-mobile-header']}>상점목록</div>}
      <EventCarousel />
      <div className={styles.filter}>
        {MOBILE_SORT_CHECK_BOX.map(({ id, content, value }) => (
          <button
            className={cn({
              [styles.filter__box]: true,
              [styles['filter__box--activate']]: storeSorter === id,
            })}
            key={value}
            type="button"
            onClick={handleSortCheckBox(id)}
          >
            {content}
          </button>
        ))}

        {MOBILE_FILTER_CHECK_BOX.map(({ id, content, value }) => (
          <button
            className={cn({
              [styles.filter__box]: true,
              [styles['filter__box--activate']]: storeFilterList[id],
            })}
            key={value}
            type="button"
            onClick={handleFilterCheckBox(id)}
          >
            {content}
          </button>
        ))}

        {isMounted && isTooltipOpen && (
          <IntroToolTip content="지금 리뷰가 가장 많은 상점을 확인해보세요!" closeTooltip={closeTooltip} />
        )}
      </div>
      {!isMobile ? (
        <DesktopStoreList storeListData={storeList} storeType={STORE_PAGE.MAIN} />
      ) : (
        <MobileStoreList storeListData={storeList} storeType={STORE_PAGE.MAIN} />
      )}
    </div>
  );
}

export default function StorePage({ dehydrateState }: { dehydrateState: unknown }) {
  return (
    <HydrationBoundary state={dehydrateState}>
      <Store />
    </HydrationBoundary>
  );
}
