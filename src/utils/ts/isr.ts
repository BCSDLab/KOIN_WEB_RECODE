import { isKoinError } from '@bcsdlab/koin';
import * as Sentry from '@sentry/nextjs';

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

function getStaticFetchStatus(error: unknown): number | 'network' | 'unknown' {
  if (isKoinError(error)) return error.status;

  if (typeof error === 'object' && error !== null && hasAxiosErrorResponse(error)) {
    return error.response?.status ?? 'network';
  }

  return 'unknown';
}

export async function withStaticFetchRetry<T>(resource: string, task: () => Promise<T>): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= STATIC_FETCH_RETRY_ATTEMPTS; attempt += 1) {
    try {
      return await Sentry.startSpan(
        {
          name: `ISR fetch: ${resource}`,
          op: 'koin.isr.fetch',
          onlyIfParent: true,
          attributes: {
            'isr.resource': resource,
            'retry.attempt': attempt + 1,
            'retry.max_attempts': STATIC_FETCH_RETRY_ATTEMPTS + 1,
          },
        },
        async (span) => {
          try {
            const result = await task();
            span.setAttribute('retry.result', 'success');
            return result;
          } catch (error) {
            span.setAttribute('retry.result', 'error');
            span.setAttribute('http.response.status_code', getStaticFetchStatus(error));
            throw error;
          }
        },
      );
    } catch (error) {
      if (!isRetryableStaticFetchError(error)) {
        throw error;
      }

      lastError = error;

      if (attempt === STATIC_FETCH_RETRY_ATTEMPTS) {
        break;
      }

      const delay = STATIC_FETCH_RETRY_DELAY_MS * (attempt + 1);
      await Sentry.startSpan(
        {
          name: `ISR retry wait: ${resource}`,
          op: 'koin.isr.retry_wait',
          onlyIfParent: true,
          attributes: {
            'isr.resource': resource,
            'retry.next_attempt': attempt + 2,
            'retry.delay_ms': delay,
          },
        },
        () =>
          new Promise((resolve) => {
            setTimeout(resolve, delay);
          }),
      );
    }
  }

  throw lastError ?? new Error('Static fetch failed without an error payload.');
}
