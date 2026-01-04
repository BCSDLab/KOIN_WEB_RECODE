import { AxiosResponse } from 'axios';
import { APIResponse } from './APIResponse';

export const HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const;

export type HTTPMethod = (typeof HTTP_METHOD)[keyof typeof HTTP_METHOD];

export type Primitive = string | number | boolean | null;
export type QueryParam = Primitive | Primitive[] | QueryParams;

export interface QueryParams {
  [key: string]: QueryParam;
}

export type APIRequest<R extends APIResponse> = {
  response: R;
  path: string;
  method: HTTPMethod;
  params?: QueryParams;
  data?: unknown;
  baseURL?: string;
  authorization?: string;
  headers?: Record<string, string | number>;
  parse?: (data: AxiosResponse<R>) => R;
  convertBody?: (data: unknown) => string;
};
