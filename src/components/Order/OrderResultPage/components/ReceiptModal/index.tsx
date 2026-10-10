import type { PaymentInfoResponse } from 'api/order/entity';
import CloseIcon from 'assets/svg/Order/Checkout/close-icon.svg';
import CenterModal from 'components/Store/mobile/common/CenterModal';

import styles from './ReceiptModal.module.scss';

// KOIN_ORDER_WEBVIEW pages/OrderFinish/components/ReceiptModal 이전. 메뉴는 수량만큼 한 줄씩 단가(옵션 포함)로 보여 준다
interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentInfo: PaymentInfoResponse;
}

const formatKRW = (number: number) => `${number.toLocaleString()}원`;

export default function ReceiptModal({ isOpen, onClose, paymentInfo }: ReceiptModalProps) {
  return (
    <CenterModal isOpen={isOpen} onClose={onClose}>
      <div className={styles.content}>
        <div className={styles.receipt}>
          <div className={styles.receipt__header}>
            <div className={styles.receipt__strong}>영수증</div>
            <button type="button" onClick={onClose} className={styles.receipt__close} aria-label="닫기">
              <CloseIcon />
            </button>
          </div>

          <div className={styles.receipt__divider} />

          <div>
            <div className={styles.receipt__strong}>{paymentInfo.shop_name}</div>
            <div className={styles.receipt__meta}>
              <div>주문번호 :{paymentInfo.id}</div>
              <div>주문일시 : {paymentInfo.requested_at.split(' ')[0]}</div>
            </div>
          </div>
          <div className={styles.receipt__divider} />
          <div className={styles.receipt__menus}>
            {paymentInfo.menus.flatMap((menu, menuIndex) => {
              const optionSum = (menu.options ?? []).reduce((sum, option) => sum + (option.option_price ?? 0), 0);
              const unitTotal = menu.price + optionSum;

              return Array.from({ length: menu.quantity }).map((_, quantityIndex) => (
                // eslint-disable-next-line react/no-array-index-key -- 메뉴 응답에 고유 id가 없고 조회 결과를 그대로 그리는 정적 목록이다
                <div key={`${menuIndex}-${quantityIndex}`} className={styles.receipt__row}>
                  <div className={styles.receipt__strong}>{menu.name}</div>
                  <div>{formatKRW(unitTotal)}</div>
                </div>
              ));
            })}
          </div>
          <div className={styles.receipt__divider} />
          <div>
            <div className={styles.receipt__row}>
              <div className={styles.receipt__strong}>주문 금액</div>
              <div>{formatKRW(paymentInfo.total_menu_price)}</div>
            </div>
            <div className={styles.receipt__row}>
              <div className={styles.receipt__strong}>배달비</div>
              <div>{formatKRW(paymentInfo.delivery_tip ?? 0)}</div>
            </div>
          </div>
          <div className={styles.receipt__divider} />
          <div className={styles.receipt__row}>
            <div className={styles.receipt__strong}>결제 정보(카드사)</div>
            <div>{paymentInfo.easy_pay_company}</div>
          </div>
          <div className={styles.receipt__divider} />
          <div>
            <div className={styles.receipt__row}>
              <div className={styles.receipt__strong}>총 결제 금액</div>
              <div>{formatKRW(paymentInfo.amount)}</div>
            </div>
            <div className={styles.receipt__row}>
              <div className={styles.receipt__strong}>결제 수단</div>
              <div>{paymentInfo.easy_pay_company}</div>
            </div>
          </div>
          {paymentInfo.order_type === 'DELIVERY' && (
            <>
              <div className={styles.receipt__divider} />
              <div className={styles.receipt__address}>
                <div className={styles.receipt__strong}>배달 주소</div>
                <div className={styles['receipt__address-text']}>
                  {paymentInfo.delivery_address} {paymentInfo.delivery_address_details}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </CenterModal>
  );
}
