// reference: https://github.com/16Yongjin/tutoring-app/tree/main/src/api
import * as Sentry from '@sentry/nextjs';
import { Refresh } from 'api/auth/APIDetail';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { CustomAxiosError, KoinError } from 'interfaces/APIError';
import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import { APIResponse } from 'interfaces/APIResponse';
import { COOKIE_KEY } from 'static/url';
import qsStringify from 'utils/ts/qsStringfy';
import { useTokenStore } from 'utils/zustand/auth';
import { useServerStateStore } from 'utils/zustand/serverState';
import { redirectToClub, redirectToLogin } from './auth';
import { deleteCookie, getCookieDomain, setCookie } from './cookie';
import { isomorphicLocalStorage } from './env';
import { saveTokensToNative } from './iosBridge';

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

  static refresh = this.of(Refresh);

  private refreshPromise: Promise<void> | null = null;

  private async refreshAccessToken(refreshToken: string) {
    // 기존에 진행 중인 refresh 요청이 있다면, 그 요청이 완료될 때까지 기다림
    if (this.refreshPromise) {
      await this.refreshPromise;
      return;
    }

    // 새 refresh 요청을 진행
    this.refreshPromise = APIClient.refresh({ refresh_token: refreshToken })
      .then((result) => {
        const domain = getCookieDomain();

        setCookie(COOKIE_KEY.AUTH_TOKEN, result.token, domain ? { domain: domain } : undefined);
        useTokenStore.getState().setToken(result.token);

        if (typeof window !== 'undefined' && window.webkit?.messageHandlers != null) {
          const currentRefreshToken = useTokenStore.getState().refreshToken || refreshToken;
          saveTokensToNative(result.token, currentRefreshToken);
        }
      })
      .catch(() => {
        useTokenStore.getState().setToken('');
        useTokenStore.getState().setRefreshToken('');

        if (typeof window !== 'undefined' && window.webkit?.messageHandlers != null) {
          saveTokensToNative('', ''); // 네이티브 상태도 동기화
          redirectToClub();
          return;
        }
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
    if (!axios.isAxiosError(error)) return Promise.reject(error);
    try {
      const originalRequest = error.config;
      const newToken = useTokenStore.getState().token;

      if (originalRequest?.headers) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
      }

      // 재요청 실행 및 결과 반환
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
      return Promise.reject(retryError);
    }
  }

  private async errorMiddleware(error: AxiosError): Promise<AxiosResponse | null> {
    if (typeof window === 'undefined') return null;

    if (error.response?.status === 401) {
      const domain = getCookieDomain();
      deleteCookie(COOKIE_KEY.AUTH_TOKEN); // 배포 후 기존 도메인 없는 쿠키들의 하위 호환성을 위해 임시 유지
      deleteCookie(COOKIE_KEY.AUTH_TOKEN, domain ? { domain } : undefined);

      try {
        const storage = isomorphicLocalStorage.getJSONItem<{ state?: { refreshToken?: string } } | null>(
          'refresh-token-storage',
          null,
        );
        const refreshToken = storage?.state?.refreshToken ?? null;

        if (refreshToken) {
          await Sentry.startSpan(
            {
              name: 'Refresh API access token',
              op: 'koin.api.auth_refresh',
              onlyIfParent: true,
              attributes: { 'api.route': normalizeApiPath(error.config?.url) },
            },
            () => this.refreshAccessToken(refreshToken),
          );
          return await this.retryRequest(error);
        }
      } catch {
        useTokenStore.getState().setToken('');
        useTokenStore.getState().setRefreshToken('');
        if (window.webkit?.messageHandlers != null) {
          saveTokensToNative('', '');
        }
      }

      redirectToLogin();
      return null;
    }

    if (error.response?.status === 403) {
      const currentToken = useTokenStore.getState().token;
      if (currentToken) {
        try {
          const response = await Sentry.startSpan(
            {
              name: 'Revalidate API user type',
              op: 'koin.api.user_revalidation',
              onlyIfParent: true,
              attributes: { 'api.route': normalizeApiPath(error.config?.url) },
            },
            () =>
              axios.get<{ user_type: 'STUDENT' | 'GENERAL' }>(`${this.baseURL}/user/auth`, {
                headers: { Authorization: `Bearer ${currentToken}` },
              }),
          );
          useTokenStore.getState().setUserType(response.data.user_type);
          return await this.retryRequest(error);
        } catch {
          return null;
        }
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

  // error 를 경우에 따라 KoinError와 AxiosError로 반환
  private createKoinErrorFromAxiosError(error: AxiosError<KoinError>): KoinError | CustomAxiosError {
    if (this.isAxiosErrorWithResponseData(error)) {
      const koinError = error.response!;
      return {
        type: 'KOIN_ERROR',
        status: koinError.status,
        code: koinError.data.code,
        message: koinError.data.message,
      };
    }
    return {
      type: 'AXIOS_ERROR',
      ...error,
    };
  }

  private createTracedKoinError(error: AxiosError<KoinError>, route: string): KoinError | CustomAxiosError {
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
    // 인증 토큰 삽입
    if (request.authorization) {
      headers.Authorization = `Bearer ${request.authorization}`;
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
