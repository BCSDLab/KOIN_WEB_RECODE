import { useRouter } from 'next/router';

import type { InProgressOrder, OrderStatus } from 'api/order/entity';
import BikeIcon from 'assets/svg/Order/Checkout/agriculture.svg';
import PickupIcon from 'assets/svg/Order/Checkout/bucket.svg';
import Button from 'components/ui/Button';
import ROUTES from 'static/routes';

import styles from './PreparingCard.module.scss';

const getOrderStatusText = (status: OrderStatus): string | null => {
  switch (status) {
    case 'COOKING':
      return '조리 중';
    case 'CONFIRMING':
      return '주문 확인 중';
    case 'DELIVERING':
      return '배달 출발';
    case 'DELIVERED':
      return '배달 완료';
    case 'PACKAGED':
      return '수령 가능';
    default:
      return null;
  }
};

const getStatusDescription = (status: OrderStatus): string | null => {
  switch (status) {
    case 'CONFIRMING':
      return '사장님이 주문을 확인하고 있어요!';
    case 'COOKING':
      return '가게에서 열심히 음식을 조리하고 있어요!';
    case 'DELIVERING':
      return '열심히 달려가는 중이에요!';
    case 'DELIVERED':
      return '배달이 완료되었어요. 감사합니다!';
    case 'PACKAGED':
      return '준비가 완료되었어요!';
    default:
      return null;
  }
};

// 서버가 내린 예정 시각(HH:mm)을 그대로 포맷한다(기기 시계와 무관). order: "오후 8:29"
const formatKoreanTime = (hhmm: string): string => {
  const [hour, minute] = hhmm.split(':');
  const numHour = Number(hour);
  const meridiem = numHour < 12 ? '오전' : '오후';
  const h12 = numHour % 12 || 12;

  return `${meridiem} ${h12}:${minute}`;
};

const getEtaText = (order: InProgressOrder): string | null => {
  if (!order.estimated_at) return null;
  const time = formatKoreanTime(order.estimated_at);

  if (order.order_type === 'DELIVERY' && (order.order_status === 'COOKING' || order.order_status === 'DELIVERING')) {
    return `${time} 도착 예정`;
  }

  if (order.order_type === 'TAKE_OUT' && order.order_status === 'COOKING') {
    return `${time} 수령 가능`;
  }

  return null;
};

interface PreparingCardProps {
  orderInfo: InProgressOrder;
}

// KOIN_ORDER_WEBVIEW pages/OrderList/components/PreparingCard 이전(준비 중 주문 카드)
export default function PreparingCard({ orderInfo }: PreparingCardProps) {
  const router = useRouter();
  const orderStatusText = getOrderStatusText(orderInfo.order_status);
  const etaText = getEtaText(orderInfo);
  const statusDescription = getStatusDescription(orderInfo.order_status);
  const isDelivery = orderInfo.order_type === 'DELIVERY';

  const goToShop = () => {
    router.push(ROUTES.OrderShop({ id: String(orderInfo.orderable_shop_id) }));
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={goToShop}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          goToShop();
        }
      }}
      className={styles.card}
    >
      <div className={styles.card__badge}>
        {isDelivery ? <BikeIcon /> : <PickupIcon />}
        <div className={styles['card__badge-label']}>{isDelivery ? '배달' : '포장'}</div>
      </div>
      <div className={styles.card__state}>
        <div className={styles.card__headline}>
          <div className={styles.card__status}>{orderStatusText}</div>
          {etaText && <div className={styles.card__eta}>{etaText}</div>}
        </div>
        <div className={styles.card__description}>{statusDescription}</div>
      </div>
      <div className={styles.card__divider} />
      <div className={styles.card__body}>
        {/* eslint-disable-next-line @next/next/no-img-element -- 오라클과 같은 원본 이미지 주소를 그대로 쓴다(next/image 최적화 경로를 거치지 않음) */}
        <img src={orderInfo.orderable_shop_thumbnail} alt="상점 메인 썸네일" className={styles.card__thumbnail} />
        <div className={styles.card__info}>
          <div className={styles.card__name}>{orderInfo.orderable_shop_name}</div>
          <div className={styles.card__title}>{orderInfo.order_title}</div>
          <div className={styles.card__amount}>{orderInfo.total_amount.toLocaleString()}원</div>
        </div>
      </div>
      <Button
        color="neutral"
        fullWidth
        className={styles.card__detail}
        onClick={(e) => {
          e.stopPropagation();
          router.push(ROUTES.OrderResult({ paymentId: String(orderInfo.payment_id) }));
        }}
      >
        주문 상세 보기
      </Button>
    </div>
  );
}
