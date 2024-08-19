import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import { CoopshopResponse } from './entity';

const COOPSHOP_IDS = {
  학생식당: 1,
  세탁소: 2,
  참빛관편의점: 3,
} as const;

export class CoopshopCafeteria<R extends CoopshopResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = `/coopshop/${COOPSHOP_IDS.학생식당}`;

  response!: R;

  auth = false;
}
