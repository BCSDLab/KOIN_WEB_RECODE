import React, { ErrorInfo } from 'react';
import { AxiosError } from 'axios';
import showToast from 'utils/ts/showToast';
import { isKoinError } from '@bcsdlab/koin';
import styles from './StoreErrorBoundary.module.scss';

interface Props {
  onErrorClick: () => void;
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  status?: number;
}

function isAxiosError(error: AxiosError<any, any> | Error): error is AxiosError<any, any> {
  return ('response' in error);
}

export default class StoreErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  // 이후에 사용시 해제
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getDerivedStateFromError(error: Error) {
    if (isKoinError(error) || isAxiosError(error)) {
      return { hasError: true, status: error.status };
    }
    return { hasError: true };
  }

  // 이후에 사용시 해제
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  componentDidCatch(error: Error, __: ErrorInfo) {
    showToast('error', error.message);
  }

  render() {
    const { children, onErrorClick } = this.props;
    const { hasError, status } = this.state;

    if (hasError && status === 404) {
      return (
        <div className={styles.container}>
          <h1>존재하지 않는 상점입니다.</h1>
          <button
            className={styles.button}
            type="button"
            onClick={onErrorClick}
          >
            상점 목록
          </button>
        </div>
      );
    }

    if (hasError) {
      return <div className={styles.container}>오류가 발생했습니다.</div>;
    }

    return children;
  }
}
