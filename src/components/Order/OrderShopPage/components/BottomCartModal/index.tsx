import { useRouter } from 'next/router';

import { useQuery } from '@tanstack/react-query';
import { orderQueries } from 'api/order/queries';
import CartCountIcon from 'components/Order/common/CartCountIcon';
import Button from 'components/ui/Button';
import ROUTES from 'static/routes';
import { formatNumber } from 'utils/ts/formatPrice';

import styles from './BottomCartModal.module.scss';

// KOIN_ORDER_WEBVIEW pages/Shop/components/BottomCartModal 이전.
// 장바구니에 이 상점 메뉴가 있을 때만 화면 하단에 고정해 금액·배달 가능 여부·장바구니 보기 버튼을 띄운다
interface BottomCartModalProps {
  id: string;
  cartItemCount: number;
  isLoggedIn: boolean;
}

export default function BottomCartModal({ id, cartItemCount, isLoggedIn }: BottomCartModalProps) {
  const router = useRouter();
  const { data } = useQuery(orderQueries.cartSummary(id, isLoggedIn));

  if (!data) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modal__bar}>
        <div>
          <p className={styles.modal__amount}>{formatNumber(data.cart_items_amount)}원</p>
          <p className={styles.modal__status}>{data.is_available ? '배달 가능' : '배달 불가'}</p>
        </div>
        <Button
          startIcon={<CartCountIcon count={cartItemCount} className={styles.modal__icon} />}
          className={styles.modal__button}
          onClick={() => router.push(ROUTES.OrderCart())}
        >
          장바구니 보기
        </Button>
      </div>
      <div className={styles.modal__safe} />
    </div>
  );
}
