import { useEffect, useRef } from 'react';

import type { OrderHistoryItem } from 'api/order/entity';
import OrderCard from 'components/Order/OrderListPage/components/OrderCard';

import styles from './OrderCardList.module.scss';

interface OrderCardListProps {
  orders: OrderHistoryItem[];
  onLoadMore: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

// KOIN_ORDER_WEBVIEW pages/OrderList/components/OrderCardList 이전. 목록 끝(감시 요소)이 보이면 다음 페이지를 불러온다
export default function OrderCardList({ orders, onLoadMore, hasNextPage, isFetchingNextPage }: OrderCardListProps) {
  const endOfListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage) return undefined;

    const element = endOfListRef.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isFetchingNextPage) {
          onLoadMore();
        }
      },
      { root: null, threshold: 0 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasNextPage, onLoadMore, isFetchingNextPage]);

  return (
    <div className={styles.list}>
      {orders.map((order) => (
        <OrderCard key={order.id} orderInfo={order} />
      ))}

      {hasNextPage && <div ref={endOfListRef} className={styles.list__end} />}
    </div>
  );
}
