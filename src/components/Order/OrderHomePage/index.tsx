import { Suspense, useState, type ComponentType, type SVGProps } from 'react';

import { cn } from '@bcsdlab/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { OrderableShopsFilter } from 'api/order/entity';
import { orderQueries } from 'api/order/queries';
import { storeMobileQueries } from 'api/storeMobile/queries';
import DeliveryIcon from 'assets/svg/Order/Home/delivery-icon.svg';
import FreeIcon from 'assets/svg/Order/Home/free-icon.svg';
import PackIcon from 'assets/svg/Order/Home/pack-icon.svg';
import PlanetSliderIcon from 'assets/svg/Order/Home/planet-icon.svg';
import CheckIcon from 'assets/svg/Store/check-icon.svg';
import CloseIcon from 'assets/svg/Store/close-icon.svg';
import DownArrowIcon from 'assets/svg/Store/down-arrow-icon.svg';
import OpenIcon from 'assets/svg/Store/open-icon.svg';
import PlanetIcon from 'assets/svg/Store/planet-closed-icon.svg';
import {
  DEFAULT_ORDER_HOME_CONDITIONS,
  getOrderableShopsParams,
  isMinOrderSelected,
  MIN_ORDER_ALL_VALUE,
  MIN_ORDER_OPTIONS,
  SORT_OPTIONS,
  type OrderHomeSort,
} from 'components/Order/OrderHomePage/constants';
import BottomModal, {
  BottomModalContent,
  BottomModalFooter,
  BottomModalHeader,
} from 'components/Store/mobile/common/BottomModal';
import ShopCard from 'components/Store/mobile/common/ShopCard';
import SearchBar from 'components/Store/mobile/StoreListPage/components/SearchBar';
import Badge from 'components/ui/Badge';
import Button from 'components/ui/Button';
import ROUTES from 'static/routes';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { formatNumber } from 'utils/ts/formatPrice';

import styles from './OrderHomePage.module.scss';

interface FilterButton {
  id: OrderableShopsFilter;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const FILTER_BUTTONS: FilterButton[] = [
  { id: 'IS_OPEN', label: '영업중', icon: OpenIcon },
  { id: 'DELIVERY_AVAILABLE', label: '배달가능', icon: DeliveryIcon },
  { id: 'TAKEOUT_AVAILABLE', label: '포장가능', icon: PackIcon },
  { id: 'FREE_DELIVERY_TIP', label: '배달팁무료', icon: FreeIcon },
];

// KOIN_ORDER_WEBVIEW pages/Home(주문 홈) 이전. 카테고리·정렬·필터·최소주문금액은 order처럼 화면 상태로만 둔다.
// 기본 조건(전체보기 + 영업중)의 상점 목록과 카테고리는 서버가 받아 본문까지 렌더한다
// order HomeLayout처럼 본문을 Suspense로 감싼다. 조건이 바뀌면 새 목록을 받는 동안 본문을 숨겼다가 다시 보인다
export default function OrderHomePage() {
  return (
    <div className={styles.page}>
      <Suspense fallback={null}>
        <OrderHomeContent />
      </Suspense>
    </div>
  );
}

function OrderHomeContent() {
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_ORDER_HOME_CONDITIONS.category);
  const [selectedFilters, setSelectedFilters] = useState<OrderableShopsFilter[]>(DEFAULT_ORDER_HOME_CONDITIONS.filters);
  const [selectedSort, setSelectedSort] = useState<OrderHomeSort>(DEFAULT_ORDER_HOME_CONDITIONS.sort);

  const [isSortModalOpen, openSortModal, closeSortModal] = useBooleanState(false);
  const [isMinOrderOpen, openMinOrderModal, closeMinOrderModal] = useBooleanState(false);

  const [minOrderAmount, setMinOrderAmount] = useState<number | null>(DEFAULT_ORDER_HOME_CONDITIONS.minOrderAmount);
  const [selectedValue, setSelectedValue] = useState<number>(MIN_ORDER_ALL_VALUE);

  const isMinOrderActive = isMinOrderSelected(minOrderAmount);

  const { data: categories } = useSuspenseQuery(storeMobileQueries.categories());
  const { data: shops } = useSuspenseQuery(
    orderQueries.orderableShops(
      getOrderableShopsParams({
        category: selectedCategory,
        filters: selectedFilters,
        sort: selectedSort,
        minOrderAmount,
      }),
    ),
  );

  const toggleFilter = (filterId: OrderableShopsFilter) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId) ? prev.filter((id) => id !== filterId) : [...prev, filterId],
    );
  };

  const handleSortSelect = (sortId: OrderHomeSort) => {
    setSelectedSort(sortId);
    closeSortModal();
  };

  const minOrderLabel = isMinOrderActive ? `최소주문금액 ${formatNumber(minOrderAmount)}원 이하` : '최소주문금액';
  const currentSortLabel = SORT_OPTIONS.find((option) => option.id === selectedSort)?.label || '기본순';

  const selectedIndex = MIN_ORDER_OPTIONS.findIndex((option) => option.value === selectedValue);
  const sliderPosition = (selectedIndex / (MIN_ORDER_OPTIONS.length - 1)) * 100;

  const handleValueSelect = () => {
    setMinOrderAmount(selectedValue);
    closeMinOrderModal();
  };

  const hasShops = shops.length > 0;

  return (
    <>
      <div className={styles.content}>
        <div className={styles['search-section']}>
          <SearchBar />
        </div>

        <div className={styles.categories} role="tablist">
          {categories.shop_categories.map((category) => {
            const isSelected = selectedCategory === category.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                className={styles.category}
                role="tab"
                aria-selected={isSelected}
                data-testid={`category-${category.name}`}
              >
                <div className={styles.category__icon}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- KOIN_ORDER_WEBVIEW와 같은 원본 이미지 주소를 쓴다 */}
                  <img
                    src={category.image_url}
                    role="presentation"
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
            <button
              type="button"
              onClick={openSortModal}
              data-testid="sortButton"
              aria-label={`정렬: ${currentSortLabel}`}
              className={styles['options__sort-button']}
            >
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
              {FILTER_BUTTONS.map((filter) => {
                const isSelected = selectedFilters.includes(filter.id);
                const IconComponent = filter.icon;

                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => toggleFilter(filter.id)}
                    className={styles['options__filter-button']}
                  >
                    <Badge
                      label={filter.label}
                      color="neutral"
                      variant="outlined"
                      size="sm"
                      startIcon={
                        <IconComponent
                          className={cn({
                            [styles['options__filter-icon']]: true,
                            [styles['options__filter-icon--active']]: isSelected,
                          })}
                        />
                      }
                      className={cn({
                        [styles['options__filter-badge']]: true,
                        [styles['options__filter-badge--active']]: isSelected,
                      })}
                    />
                  </button>
                );
              })}

              <button type="button" onClick={openMinOrderModal} className={styles['options__min-order-button']}>
                <Badge
                  label={minOrderLabel}
                  color="neutral"
                  variant="outlined"
                  size="sm"
                  endIcon={
                    <DownArrowIcon
                      className={cn({
                        [styles['options__min-order-icon']]: true,
                        [styles['options__min-order-icon--active']]: isMinOrderActive,
                      })}
                    />
                  }
                  className={cn({
                    [styles['options__filter-badge']]: true,
                    [styles['options__filter-badge--active']]: isMinOrderActive,
                  })}
                />
              </button>
            </div>
          </div>
        </div>

        {hasShops && <div className={styles.banner}>광고배너</div>}

        <div className={styles.list}>
          {hasShops ? (
            shops.map((shop) => (
              <ShopCard
                key={shop.shop_id}
                shopId={shop.orderable_shop_id}
                href={ROUTES.OrderShop({ id: String(shop.orderable_shop_id) })}
                isOpen={shop.is_open}
                name={shop.name}
                rating={shop.rating_average}
                reviewCount={shop.review_count}
                thumbnailUrl={shop.images.find((image) => image.is_thumbnail)?.image_url || ''}
                deliveryFee={shop.is_delivery_available ? shop.minimum_delivery_tip : null}
                tags={[shop.is_takeout_available && '픽업가능', shop.service_event && '서비스 증정'].filter(
                  (tag): tag is string => !!tag,
                )}
              />
            ))
          ) : (
            <div className={styles.empty}>
              <PlanetIcon />
              <div className={styles.empty__title}>이용 가능한 가게가 없어요</div>
              <div className={styles.empty__description}>조건을 변경하고 다시 검색해주세요</div>
            </div>
          )}
        </div>
      </div>

      {/* 정렬 BottomSheet */}
      <BottomModal isOpen={isSortModalOpen} onClose={closeSortModal} className={styles.sheet}>
        <BottomModalHeader>
          <div className={styles.sheet__title}> 가게 정렬</div>
          <button type="button" onClick={closeSortModal}>
            <CloseIcon />
          </button>
        </BottomModalHeader>
        <BottomModalContent>
          <div className={styles['sort-sheet__options']}>
            {SORT_OPTIONS.map((option) => (
              // eslint-disable-next-line jsx-a11y/role-supports-aria-props -- order와 같은 선택 상태 표시(접근성 트리를 KOIN_ORDER_WEBVIEW와 맞춘다)
              <button
                key={option.id}
                type="button"
                onClick={() => handleSortSelect(option.id)}
                data-testid={`sortOption-${option.id}`}
                aria-selected={selectedSort === option.id}
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

      {/* 최소 주문 금액 BottomSheet */}
      <BottomModal isOpen={isMinOrderOpen} onClose={closeMinOrderModal} className={styles.sheet}>
        <BottomModalHeader>
          <div className={styles.sheet__title}> 최소주문금액</div>
          <button type="button" onClick={closeMinOrderModal}>
            <CloseIcon />
          </button>
        </BottomModalHeader>
        <BottomModalContent>
          <div className={styles['min-order-sheet']}>
            <div className={styles['min-order-sheet__track']}>
              <div className={styles['min-order-sheet__fill']} style={{ width: `${sliderPosition}%` }} />
              <div className={styles['min-order-sheet__points']}>
                {MIN_ORDER_OPTIONS.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setSelectedValue(option.value)}
                    className={styles['min-order-sheet__point']}
                  >
                    <div
                      className={cn({
                        [styles['min-order-sheet__dot']]: true,
                        [styles['min-order-sheet__dot--active']]: option.value <= selectedValue,
                      })}
                    />
                  </button>
                ))}
              </div>
              <div className={styles['min-order-sheet__thumb']} style={{ left: `${sliderPosition}%` }}>
                <PlanetSliderIcon />
              </div>
            </div>

            <div className={styles['min-order-sheet__labels']}>
              {MIN_ORDER_OPTIONS.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => setSelectedValue(option.value)}
                  className={cn({
                    [styles['min-order-sheet__label']]: true,
                    [styles['min-order-sheet__label--selected']]: selectedValue === option.value,
                  })}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={handleValueSelect} className={styles['min-order-sheet__apply']}>
            적용하기
          </Button>
        </BottomModalContent>
        <BottomModalFooter />
      </BottomModal>
    </>
  );
}
