import type { ReactNode } from 'react';
import { isKoinError } from '@bcsdlab/koin';
import * as Sentry from '@sentry/nextjs';
import axios from 'axios';
import showToast from 'utils/ts/showToast';
import styles from './StoreErrorBoundary.module.scss';

interface Props {
  onErrorClick: () => void;
  children: ReactNode;
}

function getStatus(error: unknown): number | undefined {
  if (axios.isAxiosError(error)) return error.response?.status;
  if (isKoinError(error)) return error.status;
  return undefined;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (isKoinError(error)) return error.message;
  return '오류가 발생했습니다.';
}

export default function StoreErrorBoundary({ onErrorClick, children }: Props) {
  return (
    <Sentry.ErrorBoundary
      beforeCapture={(scope) => scope.setTag('koin.boundary', 'store')}
      onError={(error) => showToast('error', getErrorMessage(error))}
      fallback={({ error, eventId, resetError }) => {
        if (getStatus(error) === 404) {
          return (
            <div className={styles.container} role="alert">
              <h1>존재하지 않는 상점입니다.</h1>
              <button className={styles.button} type="button" onClick={onErrorClick}>
                상점 목록
              </button>
            </div>
          );
        }
        return (
          <div className={styles.container} role="alert">
            <p>오류가 발생했습니다.</p>
            {eventId && <p className={styles.eventId}>문의 시 참조 코드: {eventId}</p>}
            <div className={styles.actions}>
              <button className={styles.retryButton} type="button" onClick={resetError}>
                다시 시도
              </button>
              <button className={styles.button} type="button" onClick={onErrorClick}>
                상점 목록
              </button>
            </div>
          </div>
        );
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}
