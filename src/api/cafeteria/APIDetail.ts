import { HTTP_METHOD } from 'utils/ts/apiClient';

export default class GetCafeteriaMenu<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  auth = false;

  constructor(date: string) {
    this.path = `/dinings?date=${date}`;
  }
}
