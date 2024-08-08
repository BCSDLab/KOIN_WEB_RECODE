import { type APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import {
  type CafeteriaListResponse,
} from './entity';

export default class CafeteriaList<R extends CafeteriaListResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/dinings';

  response!: R;

  params: {
    [index: string]: string;
  };

  auth = false;

  constructor(date: string) {
    this.params = {
      date,
    };
  }
}
