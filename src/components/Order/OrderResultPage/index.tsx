import { useState } from 'react';
import { useRouter } from 'next/router';

import { cn } from '@bcsdlab/utils';
import { useQuery } from '@tanstack/react-query';
import type { OrderStatus } from 'api/order/entity';
import { orderQueries } from 'api/order/queries';
import ArrowGoIcon from 'assets/svg/Order/Cart/arrow-go-icon.svg';
import MotorcycleIcon from 'assets/svg/Order/Result/motorcycle-icon.svg';
import PackageIcon from 'assets/svg/Order/Result/package.svg';
import ReceiptIcon from 'assets/svg/Order/Result/receipt-icon.svg';
import ShoppingCartIcon from 'assets/svg/Order/Result/shopping-cart-icon.svg';
import SkilletIcon from 'assets/svg/Order/Result/skillet-icon.svg';
import BankAccountInfo from 'components/Order/common/BankAccountInfo';
import Button from 'components/ui/Button';
import ROUTES from 'static/routes';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';
import { formatPrice } from 'utils/ts/formatPrice';

import OrderMap from './components/OrderMap';
import ReceiptModal from './components/ReceiptModal';
import styles from './OrderResultPage.module.scss';

// KOIN_ORDER_WEBVIEW pages/OrderFinish(주문 완료·결과) 이전.
// 배달 완료 확인·전화 바텀시트는 order에서 여는 곳이 없어(항상 닫힘) 옮기지 않았다
const ORDER_STATE_TEXT: Partial<Record<OrderStatus, { title: string; message: string }>> = {
  CONFIRMING: { title: '주문 확인중', message: '사장님이 주문을 확인하고 있어요!' },
  COOKING: { title: '준비중', message: '가게에서 열심히 음식을 조리하고있어요!' },
  DELIVERED: { title: '배달 완료', message: '배달이 완료되었어요 감사합니다!' },
  PICKED_UP: { title: '수령 완료', message: '포장 수령이 완료되었어요 감사합니다!' },
  CANCELED: { title: '주문 취소', message: '주문이 취소되었어요' },
};

const ESTIMATED_STATUSES: OrderStatus[] = ['COOKING', 'DELIVERING', 'PACKAGED'];
const COMPLETED_STATUSES: OrderStatus[] = ['DELIVERED', 'PICKED_UP'];

// 서버가 내린 도착 예정 시각(HH:mm)을 그대로 포맷한다(기기 시계와 무관)
function formatKoreanTime(time: string): string {
  const [hh, mm] = time.split(':').map(Number);

  const period = hh < 12 ? '오전' : '오후';
  const hour = hh % 12 === 0 ? 12 : hh % 12;
  const minute = Number(mm);

  return `${period} ${hour}시 ${minute}분`;
}

interface OrderResultPageProps {
  paymentId: number;
}

export default function OrderResultPage({ paymentId }: OrderResultPageProps) {
  const router = useRouter();
  const isLoggedIn = useIsLoggedIn();
  const { data: paymentInfo, isPending } = useQuery(orderQueries.paymentInfo(paymentId, isLoggedIn));
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // order는 Suspense로 조회 중엔 아무것도 그리지 않는다
  if (isLoggedIn && isPending) return <div className={styles.page} />;

  if (!paymentInfo) {
    return (
      <div className={styles.page}>
        <div>주문 정보가 없습니다.</div>
      </div>
    );
  }

  const { title, message } = ORDER_STATE_TEXT[paymentInfo.order_status] ?? { title: '', message: '' };
  const isDelivery = paymentInfo.order_type === 'DELIVERY';
  const isConfirming = paymentInfo.order_status === 'CONFIRMING';
  const isCompleted = COMPLETED_STATUSES.includes(paymentInfo.order_status);
  const bankAccount = paymentInfo.order_status === 'CANCELED' ? null : paymentInfo.bank_account;

  const handleClickOrderCancel = () => {
    router.push(ROUTES.OrderCancel({ paymentId: String(paymentId) }));
  };

  const handleGoToShopDetail = () => {
    router.push(ROUTES.OrderShop({ id: String(paymentInfo.orderable_shop_id) }));
  };

  return (
    <div className={styles.page}>
      <div className={styles.status}>
        <div className={styles.status__title}>
          {title}
          {ESTIMATED_STATUSES.includes(paymentInfo.order_status) && paymentInfo.estimated_at && (
            <div className={styles.status__estimated}>{`${formatKoreanTime(paymentInfo.estimated_at)} 도착 예정`}</div>
          )}

          <div className={styles.status__message}>{message}</div>
        </div>
        {isConfirming && (
          <Button onClick={handleClickOrderCancel} className={styles.status__cancel}>
            취소하기
          </Button>
        )}
      </div>
      <div>
        <div className={styles.progress}>
          <div className={styles['progress__label--active']}>주문확인</div>
          <div className={isConfirming ? styles.progress__label : styles['progress__label--active']}>준비중</div>
          <div className={isCompleted ? styles['progress__label--active'] : styles.progress__label}>
            {isDelivery ? '배달' : '수령'}완료
          </div>
        </div>
        <div className={styles.progress__track}>
          <div className={styles['progress__icon--active']}>
            <ShoppingCartIcon fill="white" />
          </div>
          <div className={cn({ [styles.progress__bar]: true, [styles['progress__bar--active']]: true })} />
          <div
            className={cn({
              [styles.progress__bar]: true,
              [styles['progress__bar--long']]: true,
              [styles['progress__bar--active']]: !isConfirming,
            })}
          />
          <div className={isConfirming ? styles.progress__icon : styles['progress__icon--active']}>
            <SkilletIcon />
          </div>
          <div
            className={cn({
              [styles.progress__bar]: true,
              [styles['progress__bar--active']]: !isConfirming,
            })}
          />
          <div
            className={cn({
              [styles.progress__bar]: true,
              [styles['progress__bar--long']]: true,
              [styles['progress__bar--active']]: isCompleted,
            })}
          />
          <div className={isCompleted ? styles['progress__icon--active'] : styles.progress__icon}>
            {isDelivery ? <MotorcycleIcon /> : <PackageIcon />}
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles['content__title--first']}>{isDelivery ? '배달' : '방문'}정보</div>
        <OrderMap paymentInfo={paymentInfo} />
        <div className={cn({ [styles.card]: true, [styles['card--info']]: true })}>
          <div className={cn({ [styles.card__item]: true, [styles['card__item--bordered']]: true })}>
            {isDelivery ? '배달' : '가게'}주소
            <div className={styles.card__value}>
              {isDelivery
                ? `${paymentInfo.delivery_address} ${paymentInfo.delivery_address_details}`
                : paymentInfo.shop_address}
            </div>
          </div>
          <div className={cn({ [styles.card__item]: true, [styles['card__item--bordered']]: isDelivery })}>
            사장님에게
            <div className={styles.card__value}>
              {paymentInfo.provide_cutlery ? '수저 · 포크 받기, ' : '수저 · 포크 안 받기 '}
              {paymentInfo.to_owner}
            </div>
          </div>
          {isDelivery && (
            <div className={styles.card__item}>
              배달기사님에게
              <div className={styles.card__value}>{paymentInfo.to_rider ? paymentInfo.to_rider : '없음'}</div>
            </div>
          )}
        </div>
        <div className={styles.content__title}>주문정보</div>
        <div className={styles.order}>
          <button type="button" className={styles.order__shop} onClick={handleGoToShopDetail}>
            {paymentInfo.shop_name}
            <ArrowGoIcon />
          </button>
          <div className={styles.order__divider} />
          <ul className={styles.order__menus}>
            {paymentInfo.menus.map((menu, menuIndex) => (
              // eslint-disable-next-line react/no-array-index-key -- 메뉴 응답에 고유 id가 없고 조회 결과를 그대로 그리는 정적 목록이다
              <li key={menuIndex} className={styles.order__menu}>
                <span>{menu.name}</span>
                <span>{menu.quantity}개</span>
              </li>
            ))}
          </ul>
          <div className={styles.order__divider} />
          <div className={styles.order__total}>
            총 결제금액<span>{formatPrice(paymentInfo.amount)}</span>
          </div>
          <div className={styles.order__divider} />
          <div className={styles.order__meta}>
            <div className={styles.order__row}>
              주문번호 <div>{paymentInfo.id}</div>
            </div>
            <div className={styles.order__row}>
              주문일시 <div>{paymentInfo.requested_at.split(' ')[0]}</div>
            </div>
          </div>
          <Button className={styles.order__receipt} onClick={() => setIsReceiptOpen(true)}>
            <ReceiptIcon />
            영수증 보기
          </Button>
        </div>

        <div className={styles.content__title}>결제정보</div>
        <div className={cn({ [styles.card]: true, [styles['card--padded']]: true, [styles['card--payment']]: true })}>
          <div className={styles.payment__method}>
            결제 수단<span className={styles['payment__method-value']}>{paymentInfo.payment_method}</span>
          </div>
          {/* 취소된 주문은 입금할 필요가 없어 계좌를 숨긴다 */}
          {bankAccount && (
            <div className={styles.payment__account}>
              <BankAccountInfo
                bank={bankAccount.bank}
                accountNumber={bankAccount.account_number}
                accountHolder={bankAccount.account_holder}
              />
            </div>
          )}
        </div>
      </div>
      <ReceiptModal isOpen={isReceiptOpen} onClose={() => setIsReceiptOpen(false)} paymentInfo={paymentInfo} />
    </div>
  );
}
