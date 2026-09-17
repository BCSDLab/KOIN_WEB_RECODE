import React from 'react';
import { sendClientError } from '@bcsdlab/koin';
import * as Sentry from '@sentry/nextjs';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * 학생식당 운영정보(coopshop)는 식단 페이지의 부가 기능이다.
 * 이 데이터 조회가 실패해도 날짜 이동/식단 목록 등 나머지 페이지는 정상 동작해야 하므로,
 * 에러를 이 범위에서 흡수하고 해당 위젯만 렌더링하지 않는다.
 */
export default class CafeteriaInfoBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    sendClientError(error);
    Sentry.captureException(error);
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      return null;
    }

    return children;
  }
}
