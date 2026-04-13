import { isKoinError } from '@bcsdlab/koin';

export const ARTICLE_DETAIL_ISR_REVALIDATE_SECONDS = 60 * 10;
export const BUS_SHUTTLE_ISR_REVALIDATE_SECONDS = 60 * 30;
export const ROOM_ISR_REVALIDATE_SECONDS = 60 * 60;
export const STORE_DETAIL_ISR_REVALIDATE_SECONDS = 60 * 60;

export const ARTICLE_HOT_PATH_LIMIT = 10;
export const ROOM_HOT_PATH_LIMIT = 24;
export const STORE_HOT_PATH_LIMIT = 24;

const STATIC_FETCH_RETRY_ATTEMPTS = 2;
const STATIC_FETCH_RETRY_DELAY_MS = 300;

export function isNotFoundKoinError(error: unknown): boolean {
  return isKoinError(error) && error.status === 404;
}

function hasAxiosErrorResponse(
  error: object,
): error is {
  type: 'AXIOS_ERROR';
  response?: {
    status?: number;
  };
} {
  return 'type' in error && error.type === 'AXIOS_ERROR';
}

function isRetryableStaticFetchError(error: unknown): boolean {
  if (isKoinError(error)) {
    return error.status === 429 || error.status >= 500;
  }

  if (typeof error === 'object' && error !== null && hasAxiosErrorResponse(error)) {
    const status = error.response?.status;

    if (typeof status === 'number') {
      return status === 429 || status >= 500;
    }

    return true;
  }

  return true;
}

export async function withStaticFetchRetry<T>(task: () => Promise<T>): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= STATIC_FETCH_RETRY_ATTEMPTS; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      if (!isRetryableStaticFetchError(error)) {
        throw error;
      }

      lastError = error;

      if (attempt === STATIC_FETCH_RETRY_ATTEMPTS) {
        break;
      }

      await new Promise((resolve) => {
        setTimeout(resolve, STATIC_FETCH_RETRY_DELAY_MS * (attempt + 1));
      });
    }
  }

  throw lastError ?? new Error('Static fetch failed without an error payload.');
}
