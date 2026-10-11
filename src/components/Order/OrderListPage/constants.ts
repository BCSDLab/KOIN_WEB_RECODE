import type { OrderHistoryFilter } from 'api/order/entity';

export type OrderListTab = 'past' | 'preparing';

// order OrderList의 지난 주문 첫 조회 값(필터 없음·검색어 없음, 10개씩). 서버 프리페치와 화면이 같은 키를 쓴다
export const DEFAULT_ORDER_HISTORY_FILTER: OrderHistoryFilter = {
  limit: 10,
  period: 'NONE',
  status: 'NONE',
  type: 'NONE',
  query: '',
};
