import type { OrderHistoryItem } from 'api/order/entity';
import OrderCard from 'components/Order/OrderListPage/components/OrderCard';
import useInfiniteScroll from 'utils/hooks/ui/useInfiniteScroll';

import styles from './OrderCardList.module.scss';

interface OrderCardListProps {
  orders: OrderHistoryItem[];
  onLoadMore: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

// KOIN_ORDER_WEBVIEW pages/OrderList/components/OrderCardList 이전. 목록 끝(감시 요소)이 보이면 다음 페이지를 불러온다
export default function OrderCardList({ orders, onLoadMore, hasNextPage, isFetchingNextPage }: OrderCardListProps) {
  const endOfListRef = useInfiniteScroll(onLoadMore, hasNextPage, isFetchingNextPage, { threshold: 0 });

  return (
    <div className={styles.list}>
      {orders.map((order) => (
        <OrderCard key={order.id} orderInfo={order} />
      ))}

      {hasNextPage && <div ref={endOfListRef} className={styles.list__end} />}
    </div>
  );
}
