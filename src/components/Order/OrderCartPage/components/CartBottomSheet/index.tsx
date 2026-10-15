import { useState } from 'react';
import { useRouter } from 'next/router';

import { isKoinError } from '@bcsdlab/koin';
import { cn } from '@bcsdlab/utils';
import { useMutation } from '@tanstack/react-query';
import type { OrderType } from 'api/order/entity';
import { orderMutations } from 'api/order/mutations';
import CartCountIcon from 'components/Order/common/CartCountIcon';
import CartValidateModal, {
  type CartValidateErrorCode,
} from 'components/Order/OrderCartPage/components/CartValidateModal';
import Button from 'components/ui/Button';
import ROUTES from 'static/routes';
import { formatNumber } from 'utils/ts/formatPrice';
import showToast from 'utils/ts/showToast';

import styles from './CartBottomSheet.module.scss';

// KOIN_ORDER_WEBVIEW pages/Cart/components/BottomSheet 이전.
// 화면 하단에 고정해 총 금액·주문 가능 여부·주문하기 버튼을 띄운다. 주문하기는 장바구니를 검증하고 결제 화면으로 이동한다
const VALIDATE_ERROR_CODES: readonly string[] = ['SHOP_CLOSED', 'ORDER_AMOUNT_BELOW_MINIMUM'];

const isValidateErrorCode = (code: string): code is CartValidateErrorCode => VALIDATE_ERROR_CODES.includes(code);

interface CartBottomSheetProps {
  orderType: OrderType;
  itemCount: number;
  itemTotalAmount: number;
  totalAmount: number;
  minimumOrderAmount: number;
}

export default function CartBottomSheet({
  orderType,
  itemCount,
  itemTotalAmount,
  totalAmount,
  minimumOrderAmount,
}: CartBottomSheetProps) {
  const router = useRouter();
  const { mutate: validateCart } = useMutation(orderMutations.validateCart());
  const [errorCode, setErrorCode] = useState<CartValidateErrorCode | null>(null);

  const remainAmount = minimumOrderAmount - itemTotalAmount;
  const isOrderAvailable = orderType === 'TAKE_OUT' ? true : remainAmount <= 0;

  let statusMessage = '';

  if (orderType === 'DELIVERY') {
    statusMessage = isOrderAvailable ? '배달 가능' : `${formatNumber(remainAmount)}원 더 담으면 배달 가능`;
  } else if (orderType === 'TAKE_OUT') {
    statusMessage = '주문 가능';
  }

  const handleOrder = () => {
    validateCart(orderType, {
      onSuccess: () => {
        setErrorCode(null);
        router.push(`${ROUTES.OrderCheckout()}?orderType=${orderType}`);
      },
      onError: (error) => {
        if (!isKoinError(error)) return;

        // KoinError의 code는 number로 선언돼 있지만 이 API는 문자열 code를 내려 준다
        const code = String(error.code);
        if (isValidateErrorCode(code)) {
          setErrorCode(code);

          return;
        }

        showToast('error', error.message);
      },
    });
  };

  return (
    <div className={styles.sheet}>
      <div className={styles.sheet__bar}>
        <div>
          <div className={styles.sheet__amount}>{formatNumber(totalAmount)}원</div>
          <div className={styles.sheet__status}>{statusMessage}</div>
        </div>
        <Button
          state={isOrderAvailable ? 'default' : 'disabled'}
          startIcon={<CartCountIcon count={itemCount} />}
          className={cn({
            [styles.sheet__button]: true,
            [styles['sheet__button--disabled']]: !isOrderAvailable,
          })}
          onClick={handleOrder}
        >
          <div>주문하기</div>
        </Button>
      </div>
      <div className={styles.sheet__safe} />

      <CartValidateModal errorCode={errorCode} onClose={() => setErrorCode(null)} />
    </div>
  );
}
