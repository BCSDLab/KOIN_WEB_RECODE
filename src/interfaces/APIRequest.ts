import type { AxiosResponse } from 'axios';

import type { APIResponse } from './APIResponse';

export const HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const;

export type HTTPMethod = (typeof HTTP_METHOD)[keyof typeof HTTP_METHOD];

export interface APIRequest<R extends APIResponse> {
  response: R;
  path: string;
  method: HTTPMethod;
  params?: Record<string, unknown>;
  data?: unknown;
  baseURL?: string;
  headers?: Record<string, string | number>;
  parse?: (data: AxiosResponse<R>) => R;
  convertBody?: (data: unknown) => string;
  /** 비로그인이어도 정상인 조회(세션·사용자 정보). 세션이 끝나도 로그인 화면으로 보내지 않는다. */
  authOptional?: boolean;
  /** 인증 갱신 자체이거나 쿠키 인증과 무관한 요청. 401이어도 refresh·재시도를 하지 않는다. */
  skipAuthRefresh?: boolean;
  /** 서비스 쿠키를 보내면 안 되는 요청(예: S3 presigned URL로의 직접 업로드). 기본값 true. */
  withCredentials?: boolean;
}
