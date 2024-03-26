import { AxiosError } from 'axios';

export interface KoinError {
  type: 'koin-error';
  status: number;
  code: number;
  message: string;
}

export interface CustomAxiosError extends AxiosError {
  type: 'axios-error';
}
