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
  // 페이지 데이터에 따른 값은 컴포넌트로 넘긴다. 페이지가 effect로 store에 올리면 서버는 빈 헤더를 그린다
  title: string | ComponentType;
  rightAction?: ComponentType;
  background?: 'white' | 'gray';
  onBack?: (ctx: MobileHeaderBackContext) => void;
}

/**
 * 페이지 파일에 `const MOBILE_HEADER`로 두고 `getLayout`에서 넘긴다. 여러 페이지가 같은 설정을 쓸 때만 공유 컴포넌트 옆으로 뺀다.
 *
 * `Header`는 `<Suspense fallback={null}>` 안에 있어 슬롯이 suspend하면 헤더 전체가 사라진다.
 * 서버에서 dehydrate하지 않은 쿼리는 `useQuery`로 읽을 것.
 */
export type MobileHeaderConfig = PageHeaderConfig | { type: 'home' };
