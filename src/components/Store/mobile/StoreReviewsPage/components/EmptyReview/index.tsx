import WizIcon from 'assets/svg/Store/wiz-icon.svg';

import styles from './EmptyReview.module.scss';

// KOIN_ORDER_WEBVIEW pages/Shop/components/EmptyReview 이전
export default function EmptyReview() {
  return (
    <div className={styles.empty}>
      <WizIcon className={styles.empty__icon} />
      <p className={styles.empty__title}>작성된 리뷰가 없어요</p>
      <p className={styles.empty__description}>첫 번째 리뷰를 작성해보세요!</p>
    </div>
  );
}
