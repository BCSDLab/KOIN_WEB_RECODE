import type { OrderType } from 'api/order/entity';
import { create } from 'zustand';

// KOIN_ORDER_WEBVIEW stores/useOrderStore 이전(주문 유형).
// order는 sessionStorage에 영속하지만, 서버는 그 값을 모르므로 영속하면 장바구니 쿼리 키가 SSR과 하이드레이션에서 갈린다.
// 서버와 같은 기본값(DELIVERY)으로 시작한다
interface OrderState {
  orderType: OrderType;
}

interface OrderActions {
  setOrderType: (type: OrderType) => void;
}

export const useOrderStore = create<OrderState & OrderActions>((set) => ({
  orderType: 'DELIVERY',
  setOrderType: (type) => set({ orderType: type }),
}));
