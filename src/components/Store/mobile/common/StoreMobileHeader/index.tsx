import type { ComponentProps } from 'react';

import MobilePageHeader from 'components/layout/MobilePageHeader';

import styles from './StoreMobileHeader.module.scss';

// 주문 가능 상점(Track B) 화면 헤더. KOIN_ORDER_WEBVIEW와 본문 시작 위치(60px)를 맞춰 하네스 픽셀 비교를 하기 위해 높이를 60px로 고정한다.
// Track A 화면은 공통 MobilePageHeader로 통일했다. Track B 이전이 끝나면 이 헤더도 MobilePageHeader로 바꾼다 (parity foundation D1)
export default function StoreMobileHeader(props: ComponentProps<typeof MobilePageHeader>) {
  return <MobilePageHeader {...props} className={styles.header} />;
}
