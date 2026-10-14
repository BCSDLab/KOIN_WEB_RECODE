import { useRouter } from 'next/router';

import { useQuery } from '@tanstack/react-query';
import { orderQueries } from 'api/order/queries';
import EightIcon from 'assets/svg/Store/CartCount/eight-icon.svg';
import FiveIcon from 'assets/svg/Store/CartCount/five-icon.svg';
import FourIcon from 'assets/svg/Store/CartCount/four-icon.svg';
import NineIcon from 'assets/svg/Store/CartCount/nine-icon.svg';
import NinePlusIcon from 'assets/svg/Store/CartCount/nine-plus-icon.svg';
import OneIcon from 'assets/svg/Store/CartCount/one-icon.svg';
import SevenIcon from 'assets/svg/Store/CartCount/seven-icon.svg';
import SixIcon from 'assets/svg/Store/CartCount/six-icon.svg';
import ThreeIcon from 'assets/svg/Store/CartCount/three-icon.svg';
import TwoIcon from 'assets/svg/Store/CartCount/two-icon.svg';
import ZeroIcon from 'assets/svg/Store/CartCount/zero-icon.svg';
import Button from 'components/ui/Button';
import ROUTES from 'static/routes';

import styles from './BottomCartModal.module.scss';

// KOIN_ORDER_WEBVIEW pages/Shop/components/BottomCartModal 이전.
// 장바구니에 이 상점 메뉴가 있을 때만 화면 하단에 고정해 금액·배달 가능 여부·장바구니 보기 버튼을 띄운다
const COUNT_ICONS = [ZeroIcon, OneIcon, TwoIcon, ThreeIcon, FourIcon, FiveIcon, SixIcon, SevenIcon, EightIcon, NineIcon];

interface BottomCartModalProps {
  id: string;
  cartItemCount: number;
  isLoggedIn: boolean;
}

export default function BottomCartModal({ id, cartItemCount, isLoggedIn }: BottomCartModalProps) {
  const router = useRouter();
  const { data } = useQuery(orderQueries.cartSummary(id, isLoggedIn));

  if (!data) return null;

  const CountIcon = cartItemCount > 9 ? NinePlusIcon : COUNT_ICONS[cartItemCount];

  return (
    <div className={styles.modal}>
      <div className={styles.modal__bar}>
        <div>
          <p className={styles.modal__amount}>
            {data.cart_items_amount.toLocaleString()}
            원
          </p>
          <p className={styles.modal__status}>{data.is_available ? '배달 가능' : '배달 불가'}</p>
        </div>
        <Button
          startIcon={<CountIcon className={styles.modal__icon} />}
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
