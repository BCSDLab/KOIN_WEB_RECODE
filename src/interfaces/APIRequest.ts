import { AxiosResponse } from 'axios';
import { APIResponse } from './APIResponse';

export const HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const;

export const BODY_TYPE = {
  MULTIPART: 'multipart',
  JSON: 'json',
} as const;

export type HTTPMethod = typeof HTTP_METHOD[keyof typeof HTTP_METHOD];
export type HTTPBodyType = typeof BODY_TYPE[keyof typeof BODY_TYPE];

export type APIRequest<R extends APIResponse> = {
  response: R
  path: string
  method: HTTPMethod
  params?: any
  data?: any
  baseURL?: string
  authorization?: string;
  bodyType?: HTTPBodyType;
  headers?: Record<string, string>
  parse?: (data: AxiosResponse<R>) => R
  convertBody?: (data: any) => any
};
