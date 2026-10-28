import { isKoinError } from '@bcsdlab/koin';

// apiClient는 본문이 KoinError 모양이면 KoinError로, 아니면(빈 본문 401·503 등) axios 오류를 펼친 객체로 reject한다.
// 두 경우 모두에서 HTTP 상태 코드를 꺼낸다
export function getErrorStatus(error: unknown): number | undefined {
  if (isKoinError(error)) return error.status;
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const { response } = error as { response?: { status?: unknown } };
    if (typeof response?.status === 'number') return response.status;
  }

  return undefined;
}

export function isUnauthorizedError(error: unknown) {
  return getErrorStatus(error) === 401;
}
