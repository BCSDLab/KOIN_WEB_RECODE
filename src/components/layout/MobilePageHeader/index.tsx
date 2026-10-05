import { createContext, useContext, useEffect } from 'react';
import type { ComponentProps } from 'react';

import { cn } from '@bcsdlab/utils';
import PageHeader from 'components/ui/PageHeader';

import styles from './MobilePageHeader.module.scss';

const PageOwnedHeaderContext = createContext(false);

export const PageOwnedHeaderProvider = PageOwnedHeaderContext.Provider;

interface MobilePageHeaderProps extends ComponentProps<typeof PageHeader> {
  background?: 'white' | 'gray';
}

// 레이아웃(`mobileHeader: 'page'`)과 페이지(`'page-owned'`)가 함께 쓰는 서브 헤더 모양의 유일한 출처
export function MobilePageHeaderFrame({ background = 'white', ...props }: MobilePageHeaderProps) {
  return (
    <div className={cn({ [styles.header]: true, [styles['header--gray']]: background === 'gray' })}>
      <PageHeader {...props} />
    </div>
  );
}

// 타이틀·버튼이 페이지 데이터에 의존할 때 페이지가 직접 그린다. 레이아웃에 `page-owned`를 함께 선언해야 헤더가 겹치지 않는다
export default function MobilePageHeader(props: MobilePageHeaderProps) {
  const isPageOwned = useContext(PageOwnedHeaderContext);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && !isPageOwned) {
      console.warn(
        "[MobilePageHeader] 레이아웃 mobileHeader가 'page-owned'가 아닌 페이지에서 렌더돼 헤더가 겹칠 수 있습니다.",
      );
    }
  }, [isPageOwned]);

  return <MobilePageHeaderFrame {...props} />;
}
