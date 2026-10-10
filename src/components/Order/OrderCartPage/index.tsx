import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

import { cn } from '@bcsdlab/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AddCartRequest } from 'api/order/entity';
import { orderMutations } from 'api/order/mutations';
import { isUnauthorizedError } from 'api/order/queries';
import RightArrowIcon from 'assets/svg/Order/Cart/arrow-go-icon.svg';
import EmptyCartIcon from 'assets/svg/Order/Cart/cart-icon.svg';
import PlusIcon from 'assets/svg/Order/Cart/plus-icon.svg';
import InfoIcon from 'assets/svg/Order/Cart/primary-info-icon.svg';
import PrimaryPlusIcon from 'assets/svg/Order/Cart/primary-plus-icon.svg';
import Button from 'components/ui/Button';
import ROUTES from 'static/routes';
import { isomorphicLocalStorage } from 'utils/ts/env';
import { useOrderStore } from 'utils/zustand/order';

import CartBottomSheet from './components/CartBottomSheet';
import CartItem from './components/CartItem';
import PaymentAmount from './components/PaymentAmount';
import useOrderCart from './hooks/useOrderCart';
import styles from './OrderCartPage.module.scss';

// KOIN_ORDER_WEBVIEW pages/Cart 이전 (장바구니).
// 비로그인 화면에서 담기를 시도했다가 로그인한 경우 order는 localStorage 'menuOptions'에 담을 메뉴를 남겨 두고 장바구니에서 담는다
const STORED_MENU_OPTIONS_KEY = 'menuOptions';

// order는 { menuInfo: 담기 요청 } 형태로 저장한다. 서버에서는 isomorphicLocalStorage가 null을 돌려준다
function readStoredMenuOptions(): AddCartRequest | null {
  if (typeof window === 'undefined') return null;

  const stored = isomorphicLocalStorage.getJSONItem<AddCartRequest | { menuInfo: AddCartRequest } | null>(
    STORED_MENU_OPTIONS_KEY,
    null,
  );
  if (!stored) return null;
  isomorphicLocalStorage.removeItem(STORED_MENU_OPTIONS_KEY);

  return 'menuInfo' in stored ? stored.menuInfo : stored;
}

export default function OrderCartPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setOrderType = useOrderStore((state) => state.setOrderType);
  const { cartInfo, error: cartError, orderType, isLoggedIn } = useOrderCart();

  const { mutate: addToCart } = useMutation(orderMutations.addCart(queryClient, isLoggedIn));

  // order useCart: 401 외의 오류면 다른 주문 유형으로 다시 조회한다. 둘 다 실패해 번갈아 조회하지 않도록 한 번만 바꾼다
  const hasSwitchedOrderType = useRef(false);
  useEffect(() => {
    if (!cartError || isUnauthorizedError(cartError) || hasSwitchedOrderType.current) return;
    hasSwitchedOrderType.current = true;
    setOrderType(orderType === 'DELIVERY' ? 'TAKE_OUT' : 'DELIVERY');
  }, [cartError, orderType, setOrderType]);

  useEffect(() => {
    const request = readStoredMenuOptions();
    if (request) addToCart(request);
  }, [addToCart]);

  let infoMessage = '';

  if (!cartInfo.is_delivery_available && cartInfo.is_takeout_available) {
    infoMessage = '이 가게는 포장주문만 가능해요';
  } else if (cartInfo.is_delivery_available && !cartInfo.is_takeout_available) {
    infoMessage = '이 가게는 배달주문만 가능해요';
  }

  const goToShop = () => router.push(ROUTES.OrderShop({ id: String(cartInfo.orderable_shop_id) }));

  if (cartInfo.items.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.empty}>
          <EmptyCartIcon />
          <div className={styles.empty__text}>장바구니가 비었어요</div>
          <Button
            startIcon={<PlusIcon />}
            color="gray"
            className={styles['empty__add-button']}
            onClick={() => router.push(ROUTES.OrderHome())}
          >
            메뉴 추가
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div>
          <div className={styles['order-type']}>
            <Button
              className={cn({
                [styles['order-type__button']]: true,
                [styles['order-type__button--unavailable']]: !cartInfo.is_delivery_available,
              })}
              fullWidth
              color={orderType === 'DELIVERY' ? 'primary' : 'gray'}
              state={cartInfo.is_delivery_available ? 'default' : 'disabled'}
              onClick={() => setOrderType('DELIVERY')}
            >
              배달
            </Button>
            <Button
              className={cn({
                [styles['order-type__button']]: true,
                [styles['order-type__button--unavailable']]: !cartInfo.is_takeout_available,
              })}
              fullWidth
              color={orderType === 'TAKE_OUT' ? 'primary' : 'gray'}
              state={cartInfo.is_takeout_available ? 'default' : 'disabled'}
              onClick={() => setOrderType('TAKE_OUT')}
            >
              포장
            </Button>
          </div>

          {infoMessage && (
            <div className={styles.info}>
              <InfoIcon />
              <div className={styles.info__text}>{infoMessage}</div>
            </div>
          )}
        </div>

        <button type="button" className={styles.shop} onClick={goToShop}>
          {/* eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element -- order와 같이 alt 없이 원본 주소로 그린다(상점 이름이 바로 옆에 있고, alt를 넣으면 버튼 이름이 order와 달라진다) */}
          <img src={cartInfo.shop_thumbnail_image_url} className={styles.shop__image} />
          <div className={styles.shop__name}>{cartInfo.shop_name}</div>
          <RightArrowIcon />
        </button>

        <div>
          <div className={styles.items}>
            {cartInfo.items.map((item) => (
              <div key={item.cart_menu_item_id} className={styles.items__item}>
                <CartItem shopId={cartInfo.orderable_shop_id} item={item} />
              </div>
            ))}
          </div>
          <Button
            fullWidth
            color="neutral"
            startIcon={<PrimaryPlusIcon />}
            className={styles['more-button']}
            onClick={goToShop}
          >
            더 담으러 가기
          </Button>
        </div>

        <PaymentAmount
          orderType={orderType}
          totalAmount={cartInfo.total_amount}
          itemTotalAmount={cartInfo.items_amount}
          deliveryFee={cartInfo.delivery_fee}
          finalPaymentAmount={cartInfo.final_payment_amount}
        />
        <CartBottomSheet
          orderType={orderType}
          itemCount={cartInfo.items.reduce((total, item) => total + item.quantity, 0)}
          itemTotalAmount={cartInfo.items_amount}
          totalAmount={cartInfo.total_amount}
          minimumOrderAmount={cartInfo.shop_minimum_order_amount}
        />
      </div>
    </div>
  );
}
