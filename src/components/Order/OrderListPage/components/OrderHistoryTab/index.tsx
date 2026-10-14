import { cn } from '@bcsdlab/utils';
import type { OrderListTab } from 'components/Order/OrderListPage/constants';

import styles from './OrderHistoryTab.module.scss';

interface OrderHistoryTabProps {
  activeTab: OrderListTab;
  onTabChange: (tab: OrderListTab) => void;
}

const TABS: Array<{ id: OrderListTab; label: string }> = [
  { id: 'past', label: '지난 주문' },
  { id: 'preparing', label: '준비 중' },
];

// KOIN_ORDER_WEBVIEW pages/OrderList/components/OrderHistoryTab 이전. 헤더(60px) 아래에 고정된 탭
export default function OrderHistoryTab({ activeTab, onTabChange }: OrderHistoryTabProps) {
  return (
    <div className={styles.tab}>
      {TABS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          className={cn({ [styles.tab__button]: true, [styles['tab__button--active']]: activeTab === id })}
          onClick={() => onTabChange(id)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
