import { type APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';

import type {
  AddCartRequest,
  AddressSearchResponse,
  CampusAddressCategory,
  CampusDeliveryAddressResponse,
  CancelPaymentRequest,
  CancelPaymentResponse,
  CartResponse,
  CartSummaryResponse,
  ConfirmPaymentRequest,
  ConfirmPaymentResponse,
  DeliveryTemporaryRequest,
  OffCampusDeliveryAddressRequest,
  OffCampusDeliveryValidateRequest,
  OrderType,
  PaymentInfoResponse,
  RiderMessageResponse,
  ShopDeliveryInfoResponse,
  ShopMenuDetailResponse,
  StudentInfoResponse,
  TakeoutTemporaryRequest,
  TemporaryPaymentResponse,
  UpdateCartItemRequest,
} from './entity';

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

// KOIN_ORDER_WEBVIEW api/shop getShopMenuDetail 이전. 메뉴 상세는 로그인과 무관한 공개 데이터다
export class OrderShopMenuDetail<R extends ShopMenuDetailResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = 'order/shop/:id/menus/:menuId';

  response!: R;

  constructor(shopId: string, menuId: string) {
    this.path = `order/shop/${shopId}/menus/${menuId}`;
  }
}

// 장바구니 담기. order는 비로그인이어도 요청을 보내고 401 응답 메시지를 안내 모달로 보여 준다.
// 그래서 로그인 화면으로 보내지 않도록 authOptional로 표시하고, 비로그인이면 refresh도 시도하지 않는다(장바구니 조회와 같은 처리)
export class AddCart<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = 'cart/add';

  data: AddCartRequest;

  authOptional = true;

  skipAuthRefresh: boolean;

  response!: R;

  constructor(data: AddCartRequest, isLoggedIn: boolean) {
    this.data = data;
    this.skipAuthRefresh = !isLoggedIn;
  }
}

export class ResetCart<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.DELETE;

  path = 'cart/reset';

  response!: R;
}

// 장바구니 화면(로그인 상태)의 수량 변경·항목 삭제·주문 전 검증. order와 같은 경로·파라미터를 쓴다
export class UpdateCartItemQuantity<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = 'cart/quantity/:cartMenuItemId/:quantity';

  response!: R;

  constructor(cartMenuItemId: number, quantity: number) {
    this.path = `cart/quantity/${cartMenuItemId}/${quantity}`;
  }
}

export class DeleteCartItem<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.DELETE;

  path = 'cart/delete/:cartMenuItemId';

  response!: R;

  constructor(cartMenuItemId: number) {
    this.path = `cart/delete/${cartMenuItemId}`;
  }
}

export class ValidateCart<R extends CartResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = 'cart/validate';

  params: { order_type: OrderType };

  response!: R;

  constructor(orderType: OrderType) {
    this.params = { order_type: orderType };
  }
}

// 장바구니 항목 옵션 수정(?editCartItemId). 장바구니 화면에서만 진입하므로 로그인 상태다
export class CartItemOptions<R extends ShopMenuDetailResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = 'cart/item/:cartMenuItemId/edit';

  response!: R;

  constructor(cartMenuItemId: string) {
    this.path = `cart/item/${cartMenuItemId}/edit`;
  }
}

export class UpdateCartItemOptions<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.PUT;

  path = 'cart/item/:cartMenuItemId';

  data: UpdateCartItemRequest;

  response!: R;

  constructor(cartMenuItemId: string, data: UpdateCartItemRequest) {
    this.path = `cart/item/${cartMenuItemId}`;
    this.data = data;
  }
}

// KOIN_ORDER_WEBVIEW api/delivery 이전(배달지 선택). 경로·파라미터는 order와 같게 유지한다(parity G2)
export class AddressSearch<R extends AddressSearchResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = 'address/search';

  params: { keyword: string; currentPage: string; countPerPage: string };

  response!: R;

  constructor(keyword: string, currentPage: string, countPerPage: string) {
    this.params = { keyword, currentPage, countPerPage };
  }
}

// 교내 배달지 목록은 로그인과 무관한 공개 데이터다
export class CampusDeliveryAddresses<R extends CampusDeliveryAddressResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = 'address/delivery/campus';

  params: { filter: CampusAddressCategory };

  response!: R;

  constructor(filter: CampusAddressCategory) {
    this.params = { filter };
  }
}

export class OffCampusDeliveryValidate<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = 'delivery/address/off-campus/validate';

  data: OffCampusDeliveryValidateRequest;

  response!: R;

  constructor(data: OffCampusDeliveryValidateRequest) {
    this.data = data;
  }
}

// 교외 배달지 등록(주소 상세의 "주소 선택"). 결제 화면 이동과 함께 B8에서 쓴다
export class RegisterOffCampusDeliveryAddress<R extends object> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = 'delivery/address/off-campus';

  data: OffCampusDeliveryAddressRequest;

  response!: R;

  constructor(data: OffCampusDeliveryAddressRequest) {
    this.data = data;
  }
}

// KOIN_ORDER_WEBVIEW 결제 화면(pages/Payment) API. 경로·본문은 order와 같게 유지한다(parity G2)
// 결제 화면의 연락처 기본값(학생 정보). 결제 화면은 로그인 상태에서만 진입한다
export class StudentInfo<R extends StudentInfoResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = 'user/student/me';

  response!: R;
}

// 상점의 교내·교외 배달 가능 여부는 로그인과 무관한 공개 데이터다
export class ShopDeliveryInfo<R extends ShopDeliveryInfoResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = 'order/shop/:orderableShopId/delivery';

  response!: R;

  constructor(orderableShopId: number) {
    this.path = `order/shop/${orderableShopId}/delivery`;
  }
}

export class RiderMessages<R extends RiderMessageResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = 'delivery/rider-message';

  response!: R;
}

export class TemporaryDeliveryPayment<R extends TemporaryPaymentResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = 'payments/delivery/temporary';

  data: DeliveryTemporaryRequest;

  response!: R;

  constructor(data: DeliveryTemporaryRequest) {
    this.data = data;
  }
}

export class TemporaryTakeoutPayment<R extends TemporaryPaymentResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = 'payments/takeout/temporary';

  data: TakeoutTemporaryRequest;

  response!: R;

  constructor(data: TakeoutTemporaryRequest) {
    this.data = data;
  }
}

// KOIN_ORDER_WEBVIEW api/payments confirmPayments 이전(결제 승인). Toss 결제 성공 후 승인 화면에서 한 번 보낸다
export class ConfirmPayment<R extends ConfirmPaymentResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = 'payments/confirm';

  data: ConfirmPaymentRequest;

  response!: R;

  constructor(data: ConfirmPaymentRequest) {
    this.data = data;
  }
}

// KOIN_ORDER_WEBVIEW api/payments getPaymentInfo 이전(주문 결과 화면). 로그인 사용자의 주문만 조회된다
export class PaymentInfo<R extends PaymentInfoResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = 'payments/:paymentId';

  response!: R;

  constructor(paymentId: number) {
    this.path = `payments/${paymentId}`;
  }
}

// KOIN_ORDER_WEBVIEW api/payments cancelPayment 이전(주문 취소). 본문은 order와 같은 { cancel_reason }이다
export class CancelPayment<R extends CancelPaymentResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = 'payments/:paymentId/cancel';

  data: CancelPaymentRequest;

  response!: R;

  constructor(paymentId: number, data: CancelPaymentRequest) {
    this.path = `payments/${paymentId}/cancel`;
    this.data = data;
  }
}
