import type { ComponentProps } from 'react';

import MobilePageHeader from 'components/layout/MobilePageHeader';

import styles from './StoreMobileHeader.module.scss';

// 모바일 상점·주문 화면 헤더. KOIN_ORDER_WEBVIEW와 본문 시작 위치(60px)를 맞추기 위해 높이를 60px로 고정한다.
// 전 화면 이전이 끝나면 MobilePageHeader 기본 높이로 통일한다 (parity foundation D1)
export default function StoreMobileHeader(props: ComponentProps<typeof MobilePageHeader>) {
  return <MobilePageHeader {...props} className={styles.header} />;
}
