import { useQuery } from '@tanstack/react-query';
import { EMPTY_CART, orderQueries } from 'api/order/queries';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';
import { useOrderStore } from 'utils/zustand/order';

// KOIN_ORDER_WEBVIEW pages/Payment/hooks/useCart 이전(장바구니 화면·헤더 전체삭제 버튼이 함께 쓴다).
// 로그인이면 서버가 받은 장바구니로 그린다. 비로그인은 서버가 조회하지 않으므로 서버·하이드레이션 렌더 모두 빈 장바구니로 그리고,
// 마운트 후 order처럼 조회한다(401이면 빈 장바구니). 주문 유형을 바꾸는 동안은 직전 장바구니를 유지해 화면이 비지 않게 한다
export default function useOrderCart() {
  const isLoggedIn = useIsLoggedIn();
  const orderType = useOrderStore((state) => state.orderType);

  const { data, error } = useQuery({
    ...orderQueries.cart(orderType, isLoggedIn),
    placeholderData: (previousData) => previousData ?? EMPTY_CART,
  });

  return { cartInfo: data ?? EMPTY_CART, error, orderType, isLoggedIn };
}
