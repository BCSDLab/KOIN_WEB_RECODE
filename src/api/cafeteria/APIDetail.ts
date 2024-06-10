import { type APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import {
  DiningResponseType,
} from './entity';

export default class DiningResponse<R extends DiningResponseType> implements APIRequest<R> {
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
