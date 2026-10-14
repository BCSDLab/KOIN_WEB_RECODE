import styles from './PaymentAmount.module.scss';

// KOIN_ORDER_WEBVIEW pages/Payment/components/PaymentAmount 이전. 배달 금액은 배달 주문에서만 보인다
interface PaymentAmountProps {
  totalAmount: number;
  deliveryAmount: number | null;
  menuAmount: number;
}

export default function PaymentAmount({ totalAmount, deliveryAmount, menuAmount }: PaymentAmountProps) {
  return (
    <div className={styles.amount}>
      <div className={styles.amount__total}>
        <div>결제예정금액</div>
        <div>
          {totalAmount.toLocaleString()}
          원
        </div>
      </div>
      <div className={styles.amount__detail}>
        <div className={styles.amount__sum}>
          <div>총 금액</div>
          <div>
            {totalAmount.toLocaleString()}
            원
          </div>
        </div>
        <div className={styles.amount__item}>
          <div>메뉴 금액</div>
          <div>
            {menuAmount.toLocaleString()}
            원
          </div>
        </div>
        {!!deliveryAmount && (
          <div className={styles.amount__item}>
            <div>배달 금액</div>
            <div>
              {deliveryAmount.toLocaleString()}
              원
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
