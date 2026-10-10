import { type APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';

import type { CartResponse, CartSummaryResponse, OrderType } from './entity';

// KOIN_ORDER_WEBVIEW api/cart 이전. 경로·파라미터는 order와 같게 유지한다(parity G2).
// 장바구니는 비로그인이어도 화면이 정상이므로(빈 장바구니) authOptional로 표시해 로그인 화면으로 보내지 않는다.
// 비로그인 화면에서는 401이 정상 응답이라 refresh(세션 조회)를 시도하지 않는다. 마운트 후 세션이 로그인으로 확인되면
// 쿼리 키 범위가 auth로 바뀌어 refresh가 켜진 요청으로 다시 조회한다
export class Cart<R extends CartResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = 'cart';

  params: { type: OrderType };

  authOptional = true;

  skipAuthRefresh: boolean;

  response!: R;

  constructor(type: OrderType, isLoggedIn: boolean) {
    this.params = { type };
    this.skipAuthRefresh = !isLoggedIn;
  }
}

export class CartSummary<R extends CartSummaryResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = 'cart/summary/:orderableShopId';

  authOptional = true;

  response!: R;

  constructor(orderableShopId: string) {
    this.path = `cart/summary/${orderableShopId}`;
  }
}
