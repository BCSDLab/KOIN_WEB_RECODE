import { type APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import { DiningsResponseType } from './entity';

export default class DiningsResponse<R extends DiningsResponseType> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/dinings';

  response!: R;

  params: {
    date: string;
  };

  auth = false;

  constructor(date: string) {
    this.params = { date };
  }
}
