import React, { ErrorInfo } from 'react';
import showToast from 'utils/ts/showToast';
import { AxiosError } from 'axios';
import { sendClientError } from '@bcsdlab/koin';

interface Props {
  fallbackClassName: string;
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

function isAxiosError(error: AxiosError<any, any> | Error): error is AxiosError<any, any> {
  return ('response' in error);
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // 이후에 사용시 해제
    // eslint-disable-next-line react/no-unused-state
    this.state = { hasError: false } as State;
  }

  // 이후에 사용시 해제
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  // 이후에 사용시 해제
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  componentDidCatch(error: AxiosError<any, any> | Error, __: ErrorInfo) {
    showToast('error', isAxiosError(error) ? error.response?.data.error.message : error.message);
    sendClientError(error);
  }

  render() {
    const { children, fallbackClassName } = this.props;
    const { hasError } = this.state;
    if (hasError) {
      return (
        <div className={fallbackClassName}>
          Error
        </div>
      );
    }
    return children;
  }
}
