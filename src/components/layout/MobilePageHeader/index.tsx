import { createContext, useContext, useEffect } from 'react';
import type { ComponentProps } from 'react';

import { cn } from '@bcsdlab/utils';
import PageHeader from 'components/ui/PageHeader';

import styles from './MobilePageHeader.module.scss';

const PageHeaderLayoutContext = createContext(false);

export const PageHeaderLayoutProvider = PageHeaderLayoutContext.Provider;

interface MobilePageHeaderProps extends ComponentProps<typeof PageHeader> {
  background?: 'white' | 'gray';
}

// 리디자인 페이지의 모바일 헤더. 레이아웃에 `mobileHeader="page"`를 함께 선언해야 레거시 헤더와 겹치지 않는다
export default function MobilePageHeader({ background = 'white', ...props }: MobilePageHeaderProps) {
  const isPageLayout = useContext(PageHeaderLayoutContext);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && !isPageLayout) {
      console.warn('[MobilePageHeader] 레이아웃에 mobileHeader="page"가 없어 레거시 헤더와 겹칠 수 있습니다.');
    }
  }, [isPageLayout]);

  return (
    <div className={cn({ [styles.header]: true, [styles['header--gray']]: background === 'gray' })}>
      <PageHeader {...props} />
    </div>
  );
}
