import type { InProgressOrder } from 'api/order/entity';
import PreparingCard from 'components/Order/OrderListPage/components/PreparingCard';

import styles from './PreparingCardList.module.scss';

interface PreparingCardListProps {
  orders: InProgressOrder[];
}

// KOIN_ORDER_WEBVIEW pages/OrderList/components/PreparingCardList 이전
export default function PreparingCardList({ orders }: PreparingCardListProps) {
  return (
    <div className={styles.list}>
      {orders.map((order) => (
        <PreparingCard key={order.id} orderInfo={order} />
      ))}
    </div>
  );
}
