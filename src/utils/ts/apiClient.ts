// reference: https://github.com/16Yongjin/tutoring-app/tree/main/src/api
import axios, { AxiosError, AxiosResponse } from 'axios';
import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import { APIResponse } from 'interfaces/APIResponse';
import { CustomAxiosError, KoinError } from 'interfaces/APIError';
import qsStringify from 'utils/ts/qsStringfy';
import { Refresh } from 'api/auth/APIDetail';
import { useTokenStore } from 'utils/zustand/auth';
import { deleteCookie, setCookie } from './cookie';
import { redirectToLogin } from './auth';
import { saveTokensToNative } from './iosBridge';

const API_URL = import.meta.env.VITE_API_PATH;

type Constructor<T> = new (...args: any[]) => T;

// eslint-disable-next-line
type ResponseType<T> = T extends APIRequest<infer T> ? T : never

export default class APIClient {
  // API Client Singleton
  static shared = new APIClient();

  static request<U extends APIResponse>(request: APIRequest<U>): Promise<U> {
    return APIClient.shared.request(request);
  }

  /** API를 받아서 호출할 수 있는 함수로 변환합니다. */
  static toCallable<
    T extends Constructor<any>,
    U extends InstanceType<T>,
    R extends ResponseType<U>,
  >(api: T) {
    // eslint-disable-next-line new-cap
    return (...args: ConstructorParameters<T>) => APIClient.request<R>(new api(...args));
  }

  /** API를 호출할 수 있는 함수로 변환합니다. `toCallable`의 alias */
  static of = APIClient.toCallable;

  // Local Server 또는 API Endpoint
  baseURL = API_URL;

  // 타임 아웃
  timeout: number = 20 * 1000;

  request<U extends APIResponse>(request: APIRequest<U>): Promise<U> {
    return new Promise<U>((resolve, reject) => {
      axios
        .request({
          url: request.path,
          method: request.method,
          params: request.params,
          data: request.data instanceof FormData
            ? request.data : (request.convertBody || this.convertBody)(request.data),
          paramsSerializer: (params) => qsStringify(params),
          timeout: this.timeout,
          baseURL: request.baseURL || this.baseURL,
          headers: this.createHeaders(request),
          responseType: 'json',
        })
        .then((data: AxiosResponse<U>) => {
          const response = request.parse
            ? request.parse(data)
            : this.parse<U>(data);
          resolve(response);
        })
        .catch(async (err) => {
          try {
            if (axios.isAxiosError(err)) {
              const handledResponse = await this.errorMiddleware(err);

              if (handledResponse) {
                const response = request.parse
                  ? request.parse(handledResponse)
                  : this.parse<U>(handledResponse);
                resolve(response);
                return;
              }
            }

            const apiError = this.createKoinErrorFromAxiosError(err);
            reject(apiError);
          } catch (middlewareError) {
            const apiError = this.createKoinErrorFromAxiosError(err);
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
        setCookie('AUTH_TOKEN_KEY', result.token);
        useTokenStore.getState().setToken(result.token);

        if (typeof window !== 'undefined' && window.webkit?.messageHandlers != null) {
          const currentRefreshToken = useTokenStore.getState().refreshToken || refreshToken;
          saveTokensToNative(result.token, currentRefreshToken);
        }
      })
      .catch(() => {
        if (typeof window !== 'undefined' && window.webkit?.messageHandlers != null) {
          useTokenStore.getState().setToken('');
          useTokenStore.getState().setRefreshToken('');
          saveTokensToNative('', ''); // 네이티브 상태도 동기화
          return;
        }
        redirectToLogin();
      })
      .finally(() => {
        this.refreshPromise = null;
      });

    await this.refreshPromise;
  }

  private convertBody(data: any) {
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

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
      }

      // 재요청 실행 및 결과 반환
      return await axios(originalRequest);
    } catch (retryError) {
      return Promise.reject(retryError);
    }
  }

  private async errorMiddleware(error: AxiosError): Promise<AxiosResponse | null> {
    if (error.response?.status === 401) {
      deleteCookie('AUTH_TOKEN_KEY');
      const refreshTokenStorage = localStorage.getItem('refresh-token-storage');
      if (refreshTokenStorage) {
        const refreshToken = JSON.parse(refreshTokenStorage);
        // refreshToken이 존재할 시 accessToken 재발급 요청
        if (refreshToken.state.refreshToken !== '') {
          try {
            await this.refreshAccessToken(refreshToken.state.refreshToken);
            const retryResponse = await this.retryRequest(error);
            return retryResponse;
          } catch (retryError) {
            if (typeof window !== 'undefined' && window.webkit?.messageHandlers != null) {
              useTokenStore.getState().setToken('');
              useTokenStore.getState().setRefreshToken('');
              saveTokensToNative('', ''); // 네이티브 상태도 동기화
            } else redirectToLogin();
            return null;
          }
        }
        redirectToLogin();
      }
    }
    return null;
  }

  private isAxiosErrorWithResponseData(error: AxiosError<KoinError>) {
    const { response } = error;
    return response?.status !== undefined
      && response?.data !== undefined
      && response.data.code !== undefined
      && response.data.message !== undefined;
  }

  // error 를 경우에 따라 KoinError와 AxiosError로 반환
  private createKoinErrorFromAxiosError(
    error: AxiosError<KoinError>,
  ): KoinError | CustomAxiosError {
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

  // Create headers
  private createHeaders<U extends APIResponse>(request: APIRequest<U>): any {
    const headers: Record<string, string> = {};
    // 인증 토큰 삽입
    if (request.authorization) {
      headers.Authorization = `Bearer ${request.authorization}`;
    }

    // json body 사용
    if (
      request.method === HTTP_METHOD.POST
      || request.method === HTTP_METHOD.PUT
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
