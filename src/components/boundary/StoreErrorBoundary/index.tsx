import React from 'react';
import { isKoinError } from '@bcsdlab/koin';
import axios, { AxiosError } from 'axios';
import showToast from 'utils/ts/showToast';
import styles from './StoreErrorBoundary.module.scss';

interface Props {
  onErrorClick: () => void;
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  status?: number;
}

type AppError = Error | AxiosError<unknown, unknown>;

function isAxiosError(error: AppError): error is AxiosError<unknown, unknown> {
  return axios.isAxiosError(error);
}

export default class StoreErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    if (isKoinError(error) || isAxiosError(error)) {
      // AxiosError는 status가 response?.status에 있음
      const status = isAxiosError(error) ? error.response?.status : (error as unknown as { status?: number }).status;

      return { hasError: true, status };
    }
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    showToast('error', error.message);
  }

  render() {
    const { children, onErrorClick } = this.props;
    const { hasError, status } = this.state;

    if (hasError && status === 404) {
      return (
        <div className={styles.container}>
          <h1>존재하지 않는 상점입니다.</h1>
          <button className={styles.button} type="button" onClick={onErrorClick}>
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
