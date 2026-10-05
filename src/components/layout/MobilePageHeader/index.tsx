import type { ComponentProps } from 'react';

import { cn } from '@bcsdlab/utils';
import PageHeader from 'components/ui/PageHeader';

import styles from './MobilePageHeader.module.scss';

interface MobilePageHeaderProps extends ComponentProps<typeof PageHeader> {
  background?: 'white' | 'gray';
}

// `mobileHeader: { type: 'page-owned' }` 페이지가 자기 데이터로 그리는 모바일 헤더. 레이아웃 헤더와 같은 모양·위치다
export default function MobilePageHeader({ background = 'white', ...props }: MobilePageHeaderProps) {
  return (
    <div className={cn({ [styles.header]: true, [styles['header--gray']]: background === 'gray' })}>
      <PageHeader {...props} />
    </div>
  );
}
