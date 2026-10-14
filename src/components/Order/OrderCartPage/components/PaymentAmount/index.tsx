import type { OrderType } from 'api/order/entity';

import styles from './PaymentAmount.module.scss';

// KOIN_ORDER_WEBVIEW pages/Cart/components/PaymentAmount 이전. 배달 주문일 때만 배달 금액을 보여 준다
interface PaymentAmountProps {
  orderType: OrderType;
  totalAmount: number;
  itemTotalAmount: number;
  deliveryFee: number;
  finalPaymentAmount: number;
}

export default function PaymentAmount({
  orderType,
  totalAmount,
  itemTotalAmount,
  deliveryFee,
  finalPaymentAmount,
}: PaymentAmountProps) {
  return (
    <div>
      <div className={styles.title}>결제금액을 확인해주세요</div>
      <div className={styles.card}>
        <div className={styles.card__summary}>
          <div className={styles.card__total}>
            <div>총 금액</div>
            <div>
              {totalAmount.toLocaleString()}
              원
            </div>
          </div>
          <div className={styles.card__details}>
            <div className={styles.card__row}>
              <div>메뉴 금액</div>
              <div>
                {itemTotalAmount.toLocaleString()}
                원
              </div>
            </div>
            {orderType === 'DELIVERY' && (
              <div className={styles.card__row}>
                <div>배달 금액</div>
                <div>
                  {deliveryFee.toLocaleString()}
                  원
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={styles.card__final}>
          <div>결제예정금액</div>
          <div>
            {finalPaymentAmount.toLocaleString()}
            원
          </div>
        </div>
      </div>
    </div>
  );
}
