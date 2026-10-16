import { useState } from 'react';

import { cn } from '@bcsdlab/utils';
import type { OrderHistoryPeriod, OrderHistoryStatus, OrderHistoryType } from 'api/order/entity';
import RefreshIcon from 'assets/svg/Order/List/refresh-icon.svg';
import CloseIcon from 'assets/svg/Store/close-icon.svg';
import BottomModal, {
  BottomModalContent,
  BottomModalFooter,
  BottomModalHeader,
} from 'components/Store/mobile/common/BottomModal';
import Button from 'components/ui/Button';

import styles from './FilteringModal.module.scss';

export interface OrderHistoryFilters {
  period: OrderHistoryPeriod;
  order: OrderHistoryType;
  orderInfo: OrderHistoryStatus;
}

const PERIOD_OPTIONS: Array<{ id: OrderHistoryPeriod; label: string }> = [
  { id: 'LAST_3_MONTHS', label: '최근 3개월' },
  { id: 'LAST_6_MONTHS', label: '최근 6개월' },
  { id: 'LAST_1_YEAR', label: '최근 1년' },
];

const ORDER_OPTIONS: Array<{ id: OrderHistoryType; label: string }> = [
  { id: 'DELIVERY', label: '배달' },
  { id: 'TAKE_OUT', label: '포장' },
];

const ORDER_INFO_OPTIONS: Array<{ id: OrderHistoryStatus; label: string }> = [
  { id: 'COMPLETED', label: '완료' },
  { id: 'CANCELED', label: '취소' },
];

interface FilteringModalProps {
  onClose: () => void;
  onApply: (filters: OrderHistoryFilters) => void;
  defaultFilters: OrderHistoryFilters;
}

// KOIN_ORDER_WEBVIEW pages/OrderList/components/FilteringModal 이전(조회 기간·주문 상태·주문 정보 필터).
// order처럼 열릴 때만 마운트하므로, 열릴 때의 적용값으로 선택 상태를 시작한다
export default function FilteringModal({ onClose, onApply, defaultFilters }: FilteringModalProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<OrderHistoryPeriod>(defaultFilters.period);
  const [selectedOrder, setSelectedOrder] = useState<OrderHistoryType>(defaultFilters.order);
  const [selectedOrderInfo, setSelectedOrderInfo] = useState<OrderHistoryStatus>(defaultFilters.orderInfo);

  const handleReset = () => {
    setSelectedPeriod('NONE');
    setSelectedOrder('NONE');
    setSelectedOrderInfo('NONE');
  };

  const handleApply = () => {
    onApply({ period: selectedPeriod, order: selectedOrder, orderInfo: selectedOrderInfo });
    onClose();
  };

  return (
    <BottomModal className={styles.sheet} isOpen onClose={onClose}>
      <BottomModalHeader className={cn({ [styles.sheet__section]: true, [styles.header]: true })}>
        <div className={styles.header__title}>필터</div>
        <button type="button" onClick={onClose}>
          <CloseIcon />
        </button>
      </BottomModalHeader>
      <BottomModalContent className={styles.sheet__section}>
        <div className={styles.label}>조회 기간</div>
        <div className={styles.options}>
          {PERIOD_OPTIONS.map(({ id, label }) => (
            <Button
              key={id}
              size="sm"
              color={selectedPeriod === id ? 'primary' : 'white'}
              className={styles.options__option}
              onClick={() => setSelectedPeriod(id)}
            >
              {label}
            </Button>
          ))}
        </div>
        <div className={styles.divider} />
        <div className={styles.label}>주문 상태</div>
        <div className={styles.options}>
          {ORDER_OPTIONS.map(({ id, label }) => (
            <Button
              key={id}
              size="sm"
              color={selectedOrder === id ? 'primary' : 'white'}
              className={styles.options__option}
              onClick={() => setSelectedOrder(id)}
            >
              {label}
            </Button>
          ))}
        </div>
        <div className={cn({ [styles.label]: true, [styles['label--info']]: true })}>주문 정보</div>
        <div className={styles.options}>
          {ORDER_INFO_OPTIONS.map(({ id, label }) => (
            <Button
              key={id}
              size="sm"
              color={selectedOrderInfo === id ? 'primary' : 'white'}
              className={styles.options__option}
              onClick={() => setSelectedOrderInfo(id)}
            >
              {label}
            </Button>
          ))}
        </div>
        <div className={styles.actions}>
          <Button color="neutral" className={styles.actions__reset} onClick={handleReset} endIcon={<RefreshIcon />}>
            초기화
          </Button>
          <Button color="primary" className={styles.actions__apply} onClick={handleApply}>
            적용하기
          </Button>
        </div>
      </BottomModalContent>

      <BottomModalFooter className={styles.sheet__section} />
    </BottomModal>
  );
}
