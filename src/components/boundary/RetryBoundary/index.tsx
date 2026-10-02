import React from 'react';
import { useRouter } from 'next/router';

import { sendClientError } from '@bcsdlab/koin';
import * as Sentry from '@sentry/nextjs';
import { QueryErrorResetBoundary } from '@tanstack/react-query';

import styles from './RetryBoundary.module.scss';

interface InnerProps {
  onReset: () => void;
  resetKey: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

interface InnerState {
  hasError: boolean;
}

class Inner extends React.Component<InnerProps, InnerState> {
  state: InnerState = { hasError: false };

  static getDerivedStateFromError(): InnerState {
    return { hasError: true };
  }

  componentDidUpdate(prevProps: InnerProps) {
    const { resetKey } = this.props;
    const { hasError } = this.state;
    // 다른 페이지로 이동하면 에러 상태를 풀어 새 페이지를 그린다.
    if (hasError && prevProps.resetKey !== resetKey) this.setState({ hasError: false });
  }

  componentDidCatch(error: Error) {
    sendClientError(error);
    Sentry.captureException(error);
  }

  handleRetry = () => {
    const { onReset } = this.props;
    onReset();
    this.setState({ hasError: false });
  };

  render() {
    const { children, fallback } = this.props;
    const { hasError } = this.state;
    if (!hasError) return children;
    if (fallback !== undefined) return fallback;

    return (
      <div className={styles.fallback} role="alert">
        <p className={styles.fallback__message}>정보를 불러오지 못했어요.</p>
        <button type="button" className={styles.fallback__button} onClick={this.handleRetry}>
          다시 시도
        </button>
      </div>
    );
  }
}

/** 렌더 중 던져진 쿼리 에러를 잡아 빈 화면 대신 재시도 UI를 보여준다. 재시도 시 실패한 쿼리를 리셋하고, 페이지를 옮기면 풀린다. */
interface RetryBoundaryProps {
  children: React.ReactNode;
  /** 지정하면 기본 재시도 UI 대신 이것을 보여준다(헤더처럼 자리가 작은 영역은 null). */
  fallback?: React.ReactNode;
}

export default function RetryBoundary({ children, fallback }: RetryBoundaryProps) {
  const { pathname } = useRouter();

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <Inner onReset={reset} resetKey={pathname} fallback={fallback}>
          {children}
        </Inner>
      )}
    </QueryErrorResetBoundary>
  );
}
