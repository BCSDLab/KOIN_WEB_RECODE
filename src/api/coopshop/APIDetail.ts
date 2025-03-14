import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import type { CoopShopDetailResponse, CoopShopResponse } from './entity';

const COOPSHOP_IDS = {
  학생식당: 1,
  복지관식당: 2,
  대즐: 3,
  서점: 4,
} as const;

export class CoopShop<R extends CoopShopResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/coopshop';

  response!: R;

  auth = false;
}

export class CoopShopCafeteria<R extends CoopShopDetailResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = `/coopshop/${COOPSHOP_IDS.학생식당}`;

  response!: R;

  auth = false;
}
