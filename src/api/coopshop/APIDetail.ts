import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import { CoopshopResponse } from './entity';

// /coopshop/1: 학생식당
// /coopshop/2: 세탁소
// /coopshop/3: 참빛관 편의점

export class CoopshopCafeteria<R extends CoopshopResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/coopshop/1';

  response!: R;

  auth = false;
}
