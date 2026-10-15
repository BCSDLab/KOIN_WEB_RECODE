import { useRouter } from 'next/router';

import type { OrderHistoryItem, OrderStatus } from 'api/order/entity';
import LeftArrowIcon from 'assets/svg/Order/List/left-arrow-icon.svg';
import Button from 'components/ui/Button';
import ROUTES from 'static/routes';

import styles from './OrderCard.module.scss';

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

// 서버가 내린 주문 날짜("2025.09.19")를 그대로 포맷한다. 요일은 날짜 숫자로만 계산해 기기 시계·시간대와 무관하다
function formatOrderDate(dateStr: string) {
  const [year, month, day] = dateStr.split(/\D+/).map(Number);
  const dayOfWeek = DAY_NAMES[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];

  return `${month}월 ${day}일 (${dayOfWeek})`;
}

const getOrderStatusText = (status: OrderStatus): string => {
  switch (status) {
    case 'PICKED_UP':
      return '포장완료';
    case 'DELIVERED':
      return '배달완료';
    case 'CANCELED':
      return '주문취소';
    default:
      return '진행중';
  }
};

interface OrderCardProps {
  orderInfo: OrderHistoryItem;
}

// KOIN_ORDER_WEBVIEW pages/OrderList/components/OrderCard 이전(지난 주문 카드).
// '리뷰 쓰기'·'같은 메뉴 담기'는 order에서도 동작이 없어 버튼만 둔다
export default function OrderCard({ orderInfo }: OrderCardProps) {
  const router = useRouter();

  const goToShop = () => {
    router.push(ROUTES.OrderShop({ id: String(orderInfo.orderable_shop_id) }));
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={styles.card}
      onClick={goToShop}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          goToShop();
        }
      }}
      aria-label={`${orderInfo.orderable_shop_name} 주문 카드`}
    >
      <div className={styles.card__header}>
        <div className={styles.card__state}>
          <div className={styles.card__status}>{getOrderStatusText(orderInfo.order_status)}</div>
          <div className={styles.card__date}>{formatOrderDate(orderInfo.order_date)}</div>
        </div>
        <button
          type="button"
          className={styles.card__detail}
          onClick={(e) => {
            e.stopPropagation();
            router.push(ROUTES.OrderResult({ paymentId: String(orderInfo.payment_id) }));
          }}
        >
          <div>주문상세</div>
          <LeftArrowIcon />
        </button>
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
      <div className={styles.card__actions}>
        <Button color="gray" className={styles.card__review} fullWidth>
          리뷰 쓰기
        </Button>
        <Button color="primary" className={styles.card__reorder} fullWidth disabled={!orderInfo.open_status}>
          {orderInfo.open_status ? '같은 메뉴 담기' : '같은 메뉴 담기(오픈 전)'}
        </Button>
      </div>
    </div>
  );
}
