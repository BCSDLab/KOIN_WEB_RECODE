import type { ReactNode } from 'react';

import styles from './DeliveryPageFrame.module.scss';

// 배달지 선택 화면들의 공통 바탕(order body의 배경·글꼴·Tailwind preflight)
export default function DeliveryPageFrame({ children }: { children: ReactNode }) {
  return <div className={styles.frame}>{children}</div>;
}
