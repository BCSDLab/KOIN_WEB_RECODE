import { APIResponse } from 'interfaces/APIResponse';

export type WeatherId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface WeatherResponse extends APIResponse {
  temperature: number;
  weather: string;
  weather_id: WeatherId;
  weather_icon_url: string;
}
