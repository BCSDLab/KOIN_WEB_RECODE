import { type APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import {
  CoopshopCafeteriaType,
} from './entity';

export default class CoopshopCafeteria<R extends CoopshopCafeteriaType> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/coopshop/1'; // 1은 학생 식당임

  response!: R;

  auth = false;
}
