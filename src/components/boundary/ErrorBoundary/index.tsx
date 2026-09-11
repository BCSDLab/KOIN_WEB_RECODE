import type { ReactNode } from 'react';
import { useRouter } from 'next/router';
import * as Sentry from '@sentry/nextjs';
import axios from 'axios';
import ROUTES from 'static/routes';
import showToast from 'utils/ts/showToast';
import styles from './ErrorBoundary.module.scss';

interface AxiosErrorData {
  error?: {
    message?: string;
  };
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<AxiosErrorData>(error)) {
    return error.response?.data?.error?.message ?? '알 수 없는 오류가 발생했습니다.';
  }
  return error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
}

interface Props {
  fallbackClassName: string;
  children: ReactNode;
  /** "다시 시도"로도 복구 안 될 때를 대비한 탈출 수단. 이미 홈인 위치(예: 홈 화면 위젯)에서만 끈다. */
  showHomeAction?: boolean;
}

export default function ErrorBoundary({ fallbackClassName, children, showHomeAction = true }: Props) {
  const router = useRouter();

  return (
    <Sentry.ErrorBoundary
      beforeCapture={(scope) => scope.setTag('koin.boundary', 'generic')}
      onError={(error) => showToast('error', getErrorMessage(error))}
      fallback={({ eventId, resetError }) => (
        <div className={fallbackClassName} role="alert">
          <p className={styles.message}>
            일시적인 오류가 발생했습니다.
            {eventId && ` (참조 코드: ${eventId})`}
          </p>
          <div className={styles.actions}>
            <button type="button" className={styles.retryButton} onClick={resetError}>
              다시 시도
            </button>
            {showHomeAction && (
              <button type="button" className={styles.retryButton} onClick={() => router.push(ROUTES.Main())}>
                홈으로
              </button>
            )}
          </div>
        </div>
      )}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}
