import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import { WeatherResponse } from './entity';

export class WeatherInfo<R extends WeatherResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/weather';

  response!: R;

  auth = false;
}
