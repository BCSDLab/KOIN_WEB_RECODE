import { useCallback, useState } from 'react';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { OrderHistoryPeriod, OrderHistoryStatus, OrderHistoryType } from 'api/order/entity';
import { orderQueries } from 'api/order/queries';
import SleepingIcon from 'assets/svg/Order/List/sleeping-icon.svg';
import FilteringModal, { type OrderHistoryFilters } from 'components/Order/OrderListPage/components/FilteringModal';
import FilteringSearchBar from 'components/Order/OrderListPage/components/FilteringSearchBar';
import OrderCardList from 'components/Order/OrderListPage/components/OrderCardList';
import OrderHistoryTab from 'components/Order/OrderListPage/components/OrderHistoryTab';
import PreparingCardList from 'components/Order/OrderListPage/components/PreparingCardList';
import { DEFAULT_ORDER_HISTORY_FILTER, type OrderListTab } from 'components/Order/OrderListPage/constants';
import useIsScrolled from 'components/Order/OrderListPage/hooks/useIsScrolled';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';

import styles from './OrderListPage.module.scss';

function getPeriodLabel(period: OrderHistoryPeriod) {
  switch (period) {
    case 'LAST_3_MONTHS':
      return '최근 3개월';
    case 'LAST_6_MONTHS':
      return '최근 6개월';
    case 'LAST_1_YEAR':
      return '최근 1년';
    default:
      return '조회 기간';
  }
}

const ORDER_TYPE_LABEL: Record<OrderHistoryType, string> = { NONE: '', DELIVERY: '배달', TAKE_OUT: '포장' };
const ORDER_INFO_LABEL: Record<OrderHistoryStatus, string> = { NONE: '', COMPLETED: '완료', CANCELED: '취소' };

function getOrderLabel(order: OrderHistoryType, orderInfo: OrderHistoryStatus) {
  const combined = [ORDER_TYPE_LABEL[order], ORDER_INFO_LABEL[orderInfo]].filter(Boolean).join(' · ');

  return combined || '주문 상태 · 정보';
}

function EmptyOrders() {
  return (
    <div className={styles.empty}>
      <SleepingIcon />
      <div>주문 내역이 없어요</div>
    </div>
  );
}

const INITIAL_FILTERS: OrderHistoryFilters = { period: 'NONE', order: 'NONE', orderInfo: 'NONE' };

// KOIN_ORDER_WEBVIEW pages/OrderList(주문 내역) 이전. 탭·필터·검색어는 order처럼 화면 상태로만 둔다.
// 로그인이면 지난 주문 첫 페이지(필터 기본값)와 준비 중 주문을 서버가 받아 본문까지 렌더한다
export default function OrderListPage() {
  const isLoggedIn = useIsLoggedIn();
  const [isFilterOpen, openFilter, closeFilter] = useBooleanState(false);
  const [tab, setTab] = useState<OrderListTab>('past');
  const [appliedFilters, setAppliedFilters] = useState<OrderHistoryFilters>(INITIAL_FILTERS);
  const [confirmedKeyword, setConfirmedKeyword] = useState('');
  const isScrolled = useIsScrolled();

  const { period, order, orderInfo } = appliedFilters;
  const isFiltered = period !== 'NONE' || order !== 'NONE' || orderInfo !== 'NONE';

  const {
    data: orderPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    orderQueries.orderHistory(
      { ...DEFAULT_ORDER_HISTORY_FILTER, period, status: orderInfo, type: order, query: confirmedKeyword },
      isLoggedIn,
    ),
  );
  const { data: preparingOrders, isPending: isPreparingPending } = useQuery(orderQueries.inProgressOrders(isLoggedIn));

  const handleLoadMore = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  // order는 준비 중 주문을 Suspense로 받아, 조회가 끝나기 전엔 화면 본문을 그리지 않는다
  if (isLoggedIn && isPreparingPending) return <div className={styles.page} />;

  const orders = orderPages?.pages.flatMap((page) => page.orders) ?? [];

  return (
    <div className={styles.page}>
      <OrderHistoryTab activeTab={tab} onTabChange={setTab} />
      {tab === 'past' ? (
        <>
          <div className={styles.section}>
            <FilteringSearchBar
              isScrolled={isScrolled}
              openFilter={openFilter}
              isFiltered={isFiltered}
              onReset={() => setAppliedFilters(INITIAL_FILTERS)}
              onSearchConfirm={setConfirmedKeyword}
              periodLabel={getPeriodLabel(period)}
              orderLabel={getOrderLabel(order, orderInfo)}
              isPeriod={period !== 'NONE'}
              isOrder={order !== 'NONE' || orderInfo !== 'NONE'}
            />
            <div className={styles.section__list}>
              {orders.length === 0 ? (
                <EmptyOrders />
              ) : (
                <OrderCardList
                  orders={orders}
                  hasNextPage={hasNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                  onLoadMore={handleLoadMore}
                />
              )}
            </div>
          </div>
          {isFilterOpen && (
            <FilteringModal
              onClose={closeFilter}
              defaultFilters={appliedFilters}
              onApply={(filters) => {
                setAppliedFilters(filters);
                closeFilter();
              }}
            />
          )}
        </>
      ) : (
        <div className={styles.section}>
          <PreparingCardList orders={preparingOrders ?? []} />
        </div>
      )}
    </div>
  );
}
