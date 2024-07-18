import { type APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import {
  CoopshopCafeteriaResponse,
} from './entity';

export class CoopshopCafeteria<R extends CoopshopCafeteriaResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/coopshop/1';
  // 1: 학생식당
  // 2: 세탁소
  // 3: 참빛관 편의점

  response!: R;

  auth = false;
}
