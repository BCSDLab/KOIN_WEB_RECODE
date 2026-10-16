import { useEffect, useRef } from 'react';

import type { OrderType } from 'api/order/entity';
import { isUnauthorizedError } from 'utils/ts/httpError';
import { useOrderStore } from 'utils/zustand/order';

/**
 * 장바구니 조회가 401 외의 오류로 실패하면 다른 주문 유형으로 한 번 바꿔 다시 조회하게 한다(KOIN_ORDER_WEBVIEW useCart와 같다).
 * 두 유형 모두 실패해도 번갈아 조회하지 않도록 한 번만 바꾼다. 한 화면에서 한 컴포넌트만 호출해야 한다.
 */
export default function useCartOrderTypeFallback(cartError: unknown, orderType: OrderType) {
  const setOrderType = useOrderStore((state) => state.setOrderType);
  const hasSwitchedOrderType = useRef(false);

  useEffect(() => {
    if (!cartError || isUnauthorizedError(cartError) || hasSwitchedOrderType.current) return;
    hasSwitchedOrderType.current = true;
    setOrderType(orderType === 'DELIVERY' ? 'TAKE_OUT' : 'DELIVERY');
  }, [cartError, orderType, setOrderType]);
}
