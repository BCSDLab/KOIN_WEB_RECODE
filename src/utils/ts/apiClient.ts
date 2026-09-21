// reference: https://github.com/16Yongjin/tutoring-app/tree/main/src/api
import * as Sentry from '@sentry/nextjs';
import { UserAuth, WebRefresh } from 'api/auth/APIDetail';
import axios, { type AxiosError, type AxiosResponse } from 'axios';
import type { CustomAxiosError, KoinError } from 'interfaces/APIError';
import { type APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import type { APIResponse } from 'interfaces/APIResponse';
import { WEB_AUTH_CSRF_COOKIE_KEY } from 'static/url';
import qsStringify from 'utils/ts/qsStringfy';
import { useTokenStore } from 'utils/zustand/auth';
import { useServerStateStore } from 'utils/zustand/serverState';

import { redirectToLogin } from './auth';
import { getCookie } from './cookie';
import { queryClient } from './queryClient';

const API_URL = process.env.NEXT_PUBLIC_API_PATH;

function normalizeApiPath(path: string | undefined): string {
  if (!path) return 'unknown';

  return path
    .split('?')[0]
    .replace(/\/[0-9]+(?=\/|$)/g, '/:id')
    .replace(/\/[0-9a-f]{8}-[0-9a-f-]{27,}(?=\/|$)/gi, '/:id');
}

type Constructor<T> = new (...args: never[]) => T;

type ResponseType<T> = T extends APIRequest<infer U> ? U : never;

export default class APIClient {
  // API Client Singleton
  static shared = new APIClient();

  static request<U extends APIResponse>(request: APIRequest<U>): Promise<U> {
    return APIClient.shared.request(request);
  }

  /** API를 받아서 호출할 수 있는 함수로 변환합니다. */
  static toCallable<T extends Constructor<APIRequest<APIResponse>>>(api: T) {
    return (...args: ConstructorParameters<T>) =>
      APIClient.request<ResponseType<InstanceType<T>>>(
        new api(...args) as unknown as APIRequest<ResponseType<InstanceType<T>>>,
      );
  }

  /** API를 호출할 수 있는 함수로 변환합니다. `toCallable`의 alias */
  static of = APIClient.toCallable;

  // Local Server 또는 API Endpoint
  baseURL = API_URL;

  // 타임 아웃
  timeout: number = 20 * 1000;

  request<U extends APIResponse>(request: APIRequest<U>): Promise<U> {
    const route = normalizeApiPath(request.path);

    return new Promise<U>((resolve, reject) => {
      axios
        .request({
          url: request.path,
          method: request.method,
          params: request.params,
          data:
            request.data instanceof FormData ? request.data : (request.convertBody || this.convertBody)(request.data),
          paramsSerializer: (params) => qsStringify(params),
          timeout: this.timeout,
          baseURL: request.baseURL || this.baseURL,
          headers: this.createHeaders(request),
          responseType: 'json',
          withCredentials: true,
        })
        .then((data: AxiosResponse<U>) => {
          const response = Sentry.startSpan(
            {
              name: `Parse API response: ${route}`,
              op: 'koin.api.parse',
              onlyIfParent: true,
              attributes: {
                'api.route': route,
                'http.response.status_code': data.status,
                'koin.response_shape': data.data == null ? 'null' : 'value',
              },
            },
            () => (request.parse ? request.parse(data) : this.parse<U>(data)),
          );
          resolve(response);
        })
        .catch(async (err: unknown) => {
          if (axios.isAxiosError(err) && err.response?.status === 503) {
            useServerStateStore.getState().setMaintenance(true);
            reject(err);

            return;
          }
          try {
            if (axios.isAxiosError(err)) {
              const handledResponse = await this.errorMiddleware(err);

              if (handledResponse) {
                const response = Sentry.startSpan(
                  {
                    name: `Parse retried API response: ${route}`,
                    op: 'koin.api.parse',
                    onlyIfParent: true,
                    attributes: {
                      'api.route': route,
                      'api.retry': true,
                      'http.response.status_code': handledResponse.status,
                    },
                  },
                  () => (request.parse ? request.parse(handledResponse) : this.parse<U>(handledResponse)),
                );
                resolve(response);

                return;
              }
            }

            const apiError = this.createTracedKoinError(err as AxiosError<KoinError>, route);
            reject(apiError);
          } catch {
            const apiError = this.createTracedKoinError(err as AxiosError<KoinError>, route);
            reject(apiError);
          }
        });
    });
  }

  static webRefresh = this.of(WebRefresh);

  private refreshPromise: Promise<void> | null = null;

  private async refreshAccessToken() {
    // 기존에 진행 중인 refresh 요청이 있다면, 그 요청이 완료될 때까지 기다림
    if (this.refreshPromise) {
      await this.refreshPromise;

      return;
    }

    // 새 refresh 요청을 진행
    this.refreshPromise = APIClient.webRefresh()
      .then((result) => {
        useTokenStore.getState().setUserType(result.user_type);
      })
      .catch(() => {
        useTokenStore.getState().setUserType(null);
        queryClient.clear();
        redirectToLogin();
      })
      .finally(() => {
        this.refreshPromise = null;
      });

    await this.refreshPromise;
  }

  private convertBody(data: unknown) {
    return JSON.stringify(data);
  }

  // Default parser
  private parse<U extends APIResponse>(data: AxiosResponse<U>): U {
    return data.data;
  }

  private async retryRequest(error: AxiosError) {
    // error 는 매개변수 타입상 이미 AxiosError(Error)이므로, 아래 방어적 재검증 분기에서는
    // narrowing 결과가 never가 되어 instanceof로 되짚을 수 없다. 타입 단언으로 되돌린다.
    if (!axios.isAxiosError(error)) return Promise.reject(error as Error);
    try {
      const originalRequest = error.config;

      const route = normalizeApiPath(originalRequest?.url);

      return await Sentry.startSpan(
        {
          name: `Retry API request: ${route}`,
          op: 'koin.api.retry',
          onlyIfParent: true,
          attributes: { 'api.route': route },
        },
        () => axios(originalRequest!),
      );
    } catch (retryError) {
      return Promise.reject(retryError instanceof Error ? retryError : new Error(String(retryError)));
    }
  }

  private async errorMiddleware(error: AxiosError): Promise<AxiosResponse | null> {
    if (typeof window === 'undefined') return null;

    if (error.response?.status === 401) {
      try {
        await Sentry.startSpan(
          {
            name: 'Refresh API access token',
            op: 'koin.api.auth_refresh',
            onlyIfParent: true,
            attributes: { 'api.route': normalizeApiPath(error.config?.url) },
          },
          () => this.refreshAccessToken(),
        );

        return await this.retryRequest(error);
      } catch {
        useTokenStore.getState().setUserType(null);
        queryClient.clear();
      }

      redirectToLogin();

      return null;
    }

    if (error.response?.status === 403) {
      try {
        const response = await Sentry.startSpan(
          {
            name: 'Revalidate API user type',
            op: 'koin.api.user_revalidation',
            onlyIfParent: true,
            attributes: { 'api.route': normalizeApiPath(error.config?.url) },
          },
          () => APIClient.of(UserAuth)(),
        );
        useTokenStore.getState().setUserType(response.user_type);

        return await this.retryRequest(error);
      } catch {
        return null;
      }
    }

    return null;
  }

  private isAxiosErrorWithResponseData(error: AxiosError<KoinError>) {
    const { response } = error;

    return (
      response?.status !== undefined &&
      response?.data !== undefined &&
      response.data.code !== undefined &&
      response.data.message !== undefined
    );
  }

  // error 를 경우에 따라 KoinError와 AxiosError로 반환한다.
  // isKoinError()는 type 필드만으로 판별하므로, reject()가 실제 Error 인스턴스를 넘기도록
  // Object.assign으로 필드를 얹어도 isKoinError()/기존 소비 코드와 호환된다.
  private createKoinErrorFromAxiosError(error: AxiosError<KoinError>): Error & (KoinError | CustomAxiosError) {
    if (this.isAxiosErrorWithResponseData(error)) {
      const koinError = error.response!;

      return Object.assign(new Error(koinError.data.message), {
        type: 'KOIN_ERROR' as const,
        status: koinError.status,
        code: koinError.data.code,
        message: koinError.data.message,
      });
    }

    return Object.assign(new Error(error.message), {
      type: 'AXIOS_ERROR' as const,
      ...error,
    });
  }

  private createTracedKoinError(error: AxiosError<KoinError>, route: string): Error & (KoinError | CustomAxiosError) {
    return Sentry.startSpan(
      {
        name: `Convert API error: ${route}`,
        op: 'koin.api.error_conversion',
        onlyIfParent: true,
        attributes: {
          'api.route': route,
          'http.response.status_code': error.response?.status ?? 'network',
          'koin.response_shape': error.response?.data == null ? 'null' : 'value',
        },
      },
      () => this.createKoinErrorFromAxiosError(error),
    );
  }

  // Create headers
  private createHeaders<U extends APIResponse>(request: APIRequest<U>): Record<string, string> {
    const headers: Record<string, string> = {};
    // 인증 토큰 삽입 (레거시 Bearer 인증 — 쿠키 인증으로 전환된 엔드포인트에는 더 이상 채워지지 않는다)
    if (request.authorization) {
      headers.Authorization = `Bearer ${request.authorization}`;
    }

    // 쿠키 인증 상태변경 요청은 CSRF 쿠키 값을 헤더로 되돌려 보내야 한다 (web-cookie-auth.md).
    // 쿠키가 아직 없는 요청(로그인 등)이나 SSR에서는 getCookie가 undefined를 반환해 자연히 생략된다.
    if (request.method !== HTTP_METHOD.GET) {
      const csrfToken = getCookie(WEB_AUTH_CSRF_COOKIE_KEY);
      if (csrfToken) headers['X-CSRF-Token'] = csrfToken;
    }

    // json body 사용 (FormData는 axios가 multipart boundary를 자동 설정)
    if (
      (request.method === HTTP_METHOD.POST || request.method === HTTP_METHOD.PUT) &&
      !(request.data instanceof FormData)
    ) {
      headers['Content-Type'] = 'application/json';
    }

    // 기타 헤더 삽입
    if (request.headers) {
      Object.assign(headers, request.headers);
    }

    return headers;
  }
}
