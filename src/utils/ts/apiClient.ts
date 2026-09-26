// reference: https://github.com/16Yongjin/tutoring-app/tree/main/src/api
import * as Sentry from '@sentry/nextjs';
import { UserAuth, WebRefresh } from 'api/auth/APIDetail';
import axios, { type AxiosError, type AxiosResponse } from 'axios';
import type { CustomAxiosError, KoinError } from 'interfaces/APIError';
import { type APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import type { APIResponse } from 'interfaces/APIResponse';
import { WEB_AUTH_CSRF_COOKIE_KEY } from 'static/url';
import { getServerRequestHeaders } from 'utils/ssr/cookieForwarding';
import qsStringify from 'utils/ts/qsStringfy';
import { useTokenStore } from 'utils/zustand/auth';
import { useServerStateStore } from 'utils/zustand/serverState';

import { redirectToLogin } from './auth';
import { getCookie } from './cookie';
import { queryClient } from './queryClient';

const isBrowser = typeof window !== 'undefined';
const isLocalDev = isBrowser && process.env.NODE_ENV === 'development';
const API_URL = isLocalDev ? '/api/proxy' : process.env.NEXT_PUBLIC_API_PATH;

function normalizeApiPath(path: string | undefined): string {
  if (!path) return 'unknown';

  return path
    .split('?')[0]
    .replace(/\/[0-9]+(?=\/|$)/g, '/:id')
    .replace(/\/[0-9a-f]{8}-[0-9a-f-]{27,}(?=\/|$)/gi, '/:id');
}

// 새 헤더 관심사가 생기면 createHeaders 본문을 늘리는 대신 이 파이프라인에 추가
type HeaderContributor = (request: APIRequest<APIResponse>, headers: Record<string, string>) => void;

const withSSRCookieForwarding: HeaderContributor = (_request, headers) => {
  if (isBrowser) return;
  const serverRequestHeaders = getServerRequestHeaders();
  if (serverRequestHeaders?.cookie) headers.Cookie = serverRequestHeaders.cookie;
  if (serverRequestHeaders?.origin) headers.Origin = serverRequestHeaders.origin;
};

const withCsrfToken: HeaderContributor = (request, headers) => {
  if (request.method === HTTP_METHOD.GET) return;
  const csrfToken = getCookie(WEB_AUTH_CSRF_COOKIE_KEY);
  if (csrfToken) headers['X-CSRF-Token'] = csrfToken;
};

const withJsonContentType: HeaderContributor = (request, headers) => {
  const isJsonBodyMethod = request.method === HTTP_METHOD.POST || request.method === HTTP_METHOD.PUT;
  if (isJsonBodyMethod && !(request.data instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
};

const withCustomHeaders: HeaderContributor = (request, headers) => {
  if (request.headers) Object.assign(headers, request.headers);
};

// withCustomHeaders가 마지막에 와야 호출부가 위 기본값을 덮어쓸 수 있음
const HEADER_CONTRIBUTORS: HeaderContributor[] = [
  withSSRCookieForwarding,
  withCsrfToken,
  withJsonContentType,
  withCustomHeaders,
];

type Constructor<T> = new (...args: never[]) => T;

type ResponseType<T> = T extends APIRequest<infer U> ? U : never;

export default class APIClient {
  static shared = new APIClient();

  static request<U extends APIResponse>(request: APIRequest<U>): Promise<U> {
    return APIClient.shared.request(request);
  }

  static toCallable<T extends Constructor<APIRequest<APIResponse>>>(api: T) {
    return (...args: ConstructorParameters<T>) =>
      APIClient.request<ResponseType<InstanceType<T>>>(
        new api(...args) as unknown as APIRequest<ResponseType<InstanceType<T>>>,
      );
  }

  static of = APIClient.toCallable;

  baseURL = API_URL;

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
    if (this.refreshPromise) {
      await this.refreshPromise;

      return;
    }

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

  private handleUnauthorized = async (error: AxiosError): Promise<AxiosResponse | null> => {
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
  };

  private handleForbidden = async (error: AxiosError): Promise<AxiosResponse | null> => {
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
  };

  private readonly clientErrorStrategies: Record<number, (error: AxiosError) => Promise<AxiosResponse | null>> = {
    401: this.handleUnauthorized,
    403: this.handleForbidden,
  };

  // SSR은 refresh를 할 수 없어 그대로 401을 던지는 게 정상 흐름이지만, Cookie 컨텍스트 자체가
  // 없어서 401이 난 경우(withCacheControl로 감싸지 않은 페이지 등)는 원인을 바로 알 수 있어야 한다.
  private handleServerSideError(error: AxiosError): null {
    if (error.response?.status === 401 && !getServerRequestHeaders()?.cookie) {
      console.warn(
        `[apiClient] SSR 요청 헤더 컨텍스트 없이 401 발생: ${normalizeApiPath(error.config?.url)}. ` +
          'getServerSideProps가 withCacheControl로 감싸져 있는지 확인하세요.',
      );
    }

    return null;
  }

  private async errorMiddleware(error: AxiosError): Promise<AxiosResponse | null> {
    if (typeof window === 'undefined') return this.handleServerSideError(error);

    const strategy = error.response?.status !== undefined ? this.clientErrorStrategies[error.response.status] : null;

    return strategy ? strategy(error) : null;
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

  private createHeaders<U extends APIResponse>(request: APIRequest<U>): Record<string, string> {
    const headers: Record<string, string> = {};
    HEADER_CONTRIBUTORS.forEach((contribute) => contribute(request as unknown as APIRequest<APIResponse>, headers));

    return headers;
  }
}
