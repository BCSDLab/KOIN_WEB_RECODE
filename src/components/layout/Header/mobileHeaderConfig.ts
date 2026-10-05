import type { ComponentType } from 'react';
import type { NextRouter } from 'next/router';

import type useLogger from 'utils/hooks/analytics/useLogger';

export interface MobileHeaderBackContext {
  router: NextRouter;
  logger: ReturnType<typeof useLogger>;
  goBack: (fallback?: string) => void;
}

export interface PageHeaderConfig {
  type: 'page';
  // 컴포넌트는 페이지 데이터와 무관하게 자기 일만 하는 것(경로 파라미터, 자체 조회·동작)에 쓴다
  title: string | ComponentType;
  rightAction?: ComponentType;
  background?: 'white' | 'gray';
  onBack?: (ctx: MobileHeaderBackContext) => void;
}

/**
 * 페이지 파일에 `const MOBILE_HEADER`로 두고 `getLayout`에서 넘긴다. 여러 페이지가 같은 설정을 쓸 때만 공유 컴포넌트 옆으로 뺀다.
 *
 * 타이틀·버튼이 페이지 데이터에 의존하면 `page-owned`로 두고 페이지가 `MobilePageHeader`를 직접 그린다.
 * 슬롯이 페이지 쿼리를 다시 읽으면 캐시 키로만 암묵적으로 연결되고, 레이아웃과 페이지의 Suspense 경계가 달라
 * 같은 쿼리라도 suspend 결과가 갈린다(`Header`는 `<Suspense fallback={null}>` 안이라 헤더 전체가 사라진다).
 */
export type MobileHeaderConfig = PageHeaderConfig | { type: 'page-owned' } | { type: 'home' };
