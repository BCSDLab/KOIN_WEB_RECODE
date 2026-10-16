import type { ComponentProps } from 'react';

import MobilePageHeader from 'components/layout/MobilePageHeader';

import styles from './StoreMobileHeader.module.scss';

// 주문 화면 헤더. 본문 시작 위치를 KOIN_ORDER_WEBVIEW와 같게 두려고 높이를 60px로 고정한다.
// TODO: 주문 화면을 KOIN_ORDER_WEBVIEW와 맞춰 볼 필요가 없어지면 공통 MobilePageHeader(56.8px)로 바꾼다
export default function StoreMobileHeader(props: ComponentProps<typeof MobilePageHeader>) {
  // 배경은 order 헤더와 같은 회색(#f8f8fa)
  return <MobilePageHeader background="gray" {...props} className={styles.header} />;
}
