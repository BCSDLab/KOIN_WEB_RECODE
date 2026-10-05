import { AxiosError } from 'axios';

export interface KoinError {
  type: 'KOIN_ERROR';
  status: number;
  code: number;
  message: string;
}

export interface CustomAxiosError extends AxiosError {
  type: 'AXIOS_ERROR';
}
