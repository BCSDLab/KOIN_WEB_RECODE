import { AxiosError, AxiosResponse } from 'axios';

export interface APIError {
  message: string
  status: number
  raw: AxiosError
  response?: AxiosResponse
}
