import React from 'react';
import { sendClientError } from '@bcsdlab/koin';
import { AxiosError } from 'axios';
import showToast from 'utils/ts/showToast';

interface Props {
  fallbackClassName: string;
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

function isAxiosError(error: AxiosError<any, any> | Error): error is AxiosError<any, any> {
  return 'response' in error;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // 이후에 사용시 해제
    this.state = { hasError: false } as State;
  }

  // 이후에 사용시 해제
  // static getDerivedStateFromError(_: Error) {
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  // 이후에 사용시 해제
  // componentDidCatch(error: AxiosError<any, any> | Error, __: ErrorInfo) {
  componentDidCatch(error: AxiosError<any, any> | Error) {
    showToast('error', isAxiosError(error) ? error.response?.data.error.message : error.message);
    sendClientError(error);
  }

  render() {
    const { children, fallbackClassName } = this.props;
    const { hasError } = this.state;
    if (hasError) {
      return <div className={fallbackClassName}>Error</div>;
    }
    return children;
  }
}
