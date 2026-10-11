import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';

import { cn } from '@bcsdlab/utils';
import { keepPreviousData, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import type { ShopCategory } from 'api/storeMobile/entity';
import { storeMobileQueries } from 'api/storeMobile/queries';
import CheckIcon from 'assets/svg/store/check-icon.svg';
import CloseIcon from 'assets/svg/store/close-icon.svg';
import DownArrowIcon from 'assets/svg/store/down-arrow-icon.svg';
import OpenIcon from 'assets/svg/store/open-icon.svg';
import PlanetIcon from 'assets/svg/store/planet-closed-icon.svg';
import BottomModal, {
  BottomModalContent,
  BottomModalFooter,
  BottomModalHeader,
} from 'components/Store/mobile/common/BottomModal';
import ShopCard from 'components/Store/mobile/common/ShopCard';
import { getLoggingTime, setStartLoggingTime } from 'components/Store/mobile/common/utils/loggingTime';
import Badge from 'components/ui/Badge';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useBooleanState from 'utils/hooks/state/useBooleanState';

import SearchBar from './components/SearchBar';
import useScrollLogging from './hooks/useScrollLogging';
import {
  getListRequestParams,
  parseListQuery,
  SORT_OPTIONS,
  SORT_TRACKING_MAP,
  type ListFilter,
  type SortType,
} from './utils/listQuery';
import styles from './StoreListPage.module.scss';

// KOIN_ORDER_WEBVIEW pages/NearbyShops(주변상점) 이전.
// 카테고리는 서버에 보내지 않고 받은 목록을 클라이언트에서 거른다(order와 같은 요청)
export default function StoreListPage() {
  const router = useRouter();
  const logger = useLogger();
  const [isSortModalOpen, openSortModal, closeSortModal] = useBooleanState(false);

  const { category: selectedCategory, sort: selectedSort, filter: selectedFilter } = parseListQuery(router.query);
  const { sorter, filter } = getListRequestParams(selectedSort, selectedFilter);

  const { data: categories } = useSuspenseQuery(storeMobileQueries.categories());
  const { data: shopList } = useQuery({ ...storeMobileQueries.list(sorter, filter), placeholderData: keepPreviousData });

  const shops = (shopList?.shops ?? []).filter((shop) => {
    if (!selectedCategory || selectedCategory === 1) return true;

    return shop.category_ids?.includes(selectedCategory);
  });

  const categoryName =
    categories.shop_categories.find((category) => category.id === selectedCategory)?.name || '전체보기';

  const replaceQuery = (key: 'category' | 'sort' | 'filter', value: string | null) => {
    const nextQuery = { ...router.query };
    if (value === null) delete nextQuery[key];
    else nextQuery[key] = value;

    router.replace({ pathname: ROUTES.Store(), query: nextQuery }, undefined, { shallow: true, scroll: false });
  };

  const currentSortLabel = SORT_OPTIONS.find((option) => option.id === selectedSort)?.label || '기본순';

  const handleSortSelect = (sortId: SortType) => {
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_can',
      value: `${SORT_TRACKING_MAP[sortId]}_${categoryName}`,
    });

    replaceQuery('sort', sortId === 'NONE' ? null : sortId);
    closeSortModal();
  };

  const toggleFilter = () => {
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_can',
      value: `check_open_${categoryName}`,
    });

    const nextFilter: ListFilter = selectedFilter === 'OPEN' ? null : 'OPEN';
    replaceQuery('filter', nextFilter);
  };

  const handleCategorySelect = (category: ShopCategory) => {
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_categories',
      value: category.name,
      duration_time: getLoggingTime('selectedCategoryTime'),
      event_category: 'shop_category_click',
      previous_page: categories.shop_categories.find((item) => item.id === selectedCategory)?.name || '전체보기',
      current_page: category.name,
    });

    replaceQuery('category', String(category.id));
  };

  const shopScrollLogging = useCallback(() => {
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_categories',
      value: `scroll in ${categoryName}`,
      event_category: 'scroll',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- logger는 렌더마다 새 객체라 빼고 카테고리가 바뀔 때만 다시 등록한다
  }, [categoryName]);

  useScrollLogging(shopScrollLogging);

  useEffect(() => {
    setStartLoggingTime('selectedCategoryTime');
  }, [selectedCategory]);

  const isOpenFilterActive = selectedFilter === 'OPEN';

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles['search-section']}>
          <SearchBar />
        </div>

        <div className={styles.categories}>
          {categories.shop_categories.map((category) => {
            const isSelected = selectedCategory === category.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategorySelect(category)}
                className={styles.category}
              >
                <div className={styles.category__icon}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- 오라클과 같은 원본 이미지 주소를 쓴다 */}
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className={cn({
                      [styles.category__image]: true,
                      [styles['category__image--selected']]: isSelected,
                    })}
                  />
                  {isSelected && <div className={styles.category__highlight} />}
                </div>
                <div
                  className={cn({
                    [styles.category__name]: true,
                    [styles['category__name--selected']]: isSelected,
                  })}
                >
                  {category.name}
                </div>
              </button>
            );
          })}
        </div>

        <div className={styles.options}>
          <div className={styles.options__inner}>
            <button type="button" onClick={openSortModal} className={styles['options__sort-button']}>
              <Badge
                label={currentSortLabel}
                color="primary"
                variant="outlined"
                size="sm"
                endIcon={<DownArrowIcon className={styles['options__sort-icon']} />}
                className={styles['options__sort-badge']}
              />
            </button>

            <div className={styles.options__filters}>
              <button type="button" onClick={toggleFilter} className={styles['options__filter-button']}>
                <Badge
                  label="영업중"
                  color="neutral"
                  variant="outlined"
                  size="sm"
                  startIcon={
                    <OpenIcon
                      className={cn({
                        [styles['options__open-icon']]: true,
                        [styles['options__open-icon--active']]: isOpenFilterActive,
                      })}
                    />
                  }
                  className={cn({
                    [styles['options__open-badge']]: true,
                    [styles['options__open-badge--active']]: isOpenFilterActive,
                  })}
                />
              </button>
            </div>
          </div>
        </div>

        <div className={styles.list}>
          {shops.length > 0 ? (
            shops.map((shop) => (
              <ShopCard
                key={shop.id}
                shopId={shop.id}
                isOpen={shop.is_open}
                name={shop.name}
                rating={shop.average_rate}
                reviewCount={shop.review_count}
                thumbnailUrl={shop.images[0] ?? ''}
                isOrderable={false}
              />
            ))
          ) : (
            <div className={styles.empty}>
              <PlanetIcon className={styles.empty__icon} />
              <div className={styles.empty__title}>이용 가능한 가게가 없어요</div>
              <div className={styles.empty__description}>조건을 변경하고 다시 검색해주세요</div>
            </div>
          )}
        </div>

        <BottomModal isOpen={isSortModalOpen} onClose={closeSortModal}>
          <BottomModalHeader>
            <div className={styles['sort-sheet__title']}>가게 정렬</div>
            <button type="button" onClick={closeSortModal} className={styles['sort-sheet__close']}>
              <CloseIcon className={styles['sort-sheet__close-icon']} />
            </button>
          </BottomModalHeader>
          <BottomModalContent>
            <div className={styles['sort-sheet__options']}>
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSortSelect(option.id)}
                  className={cn({
                    [styles['sort-sheet__option']]: true,
                    [styles['sort-sheet__option--selected']]: selectedSort === option.id,
                  })}
                >
                  {option.label}
                  {selectedSort === option.id && <CheckIcon className={styles['sort-sheet__check']} />}
                </button>
              ))}
            </div>
          </BottomModalContent>
          <BottomModalFooter />
        </BottomModal>
      </div>
    </div>
  );
}
