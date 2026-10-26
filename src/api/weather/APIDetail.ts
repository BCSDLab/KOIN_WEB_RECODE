import { type APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';

import type { WeatherResponse } from './entity';

export class WeatherInfo<R extends WeatherResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/weather';

  response!: R;

  auth = false;
}
