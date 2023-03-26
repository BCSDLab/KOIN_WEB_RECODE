import { APIRequest } from 'interfaces/APIRequest';
import { HTTP_METHOD } from 'utils/ts/apiClient';
import {
  CafeteriaMenuResponse,
} from './entity';

export default class GetCafeteriaMenu<R extends CafeteriaMenuResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  auth = false;

  constructor(date: string) {
    this.path = `/dinings?date=${date}`;
  }
}
