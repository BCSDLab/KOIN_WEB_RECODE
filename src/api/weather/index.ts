import APIClient from 'utils/ts/apiClient';
import { WeatherInfo } from './APIDetail';

export const getWeatherInfo = APIClient.of(WeatherInfo);
