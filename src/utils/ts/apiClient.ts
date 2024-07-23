// reference: https://github.com/16Yongjin/tutoring-app/tree/main/src/api
import axios, { AxiosError, AxiosResponse } from 'axios';
import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import { APIResponse } from 'interfaces/APIResponse';
import { CustomAxiosError, KoinError } from 'interfaces/APIError';
import { deleteCookie } from './cookie';

const API_URL = process.env.REACT_APP_API_PATH;

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
          data: (request.convertBody || this.convertBody)(request.data),
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
        .catch((err) => {
          const apiError = this.createKoinErrorFromAxiosError(err);
          this.errorMiddleware(apiError);
          reject(apiError);
        });
    });
  }

  private convertBody(data: any) {
    return JSON.stringify(data);
  }

  // Default parser
  private parse<U extends APIResponse>(data: AxiosResponse<U>): U {
    return data.data;
  }

  private errorMiddleware(error: KoinError | CustomAxiosError) {
    const refreshTokenStorage = localStorage.getItem('refresh-token-storage');
    if (error.status === 401) {
      deleteCookie('AUTH_TOKEN_KEY');
      if (refreshTokenStorage) {
        const refreshToken = JSON.parse(refreshTokenStorage);
        if (refreshToken.state.refreshToken !== '') {
          window.location.reload();
          return;
        }
      }
      window.location.href = '/auth';
    }
  }

  private isAxiosErrorWithResponseData(error: AxiosError<KoinError>) {
    const { response } = error;
    return response?.status !== undefined
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
