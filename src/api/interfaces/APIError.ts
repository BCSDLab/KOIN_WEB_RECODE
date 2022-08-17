import { AxiosError, AxiosResponse } from 'axios';

export interface APIError {
  message: string
  status: number
  errors: Record<string, string>
  raw: AxiosError
  response?: AxiosResponse
}