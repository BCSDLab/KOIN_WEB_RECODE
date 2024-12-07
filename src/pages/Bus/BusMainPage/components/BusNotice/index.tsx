import InformationIcon from 'assets/svg/Bus/information-icon.svg';
import CloseIcon from 'assets/svg/common/close/close-icon-32x32.svg';
import { useState } from 'react';
import styles from './BusNotice.module.scss';

export default function BusNotice() {
  const [showNotice, setShowNotice] = useState(() => localStorage.getItem('noticeDismissed') !== 'true');
  const content = '[긴급] 9.27(금) 대학등교방향 천안셔틀버스 터미널 미정차 알림(천안역에서 승차바람)';

  const handleDismissNotice = () => {
    localStorage.setItem('noticeDismissed', 'true');
    setShowNotice(false);
  };

  // TODO: 공지사항 내용 api 연동

  if (!showNotice) return null;

  return (
    <div className={styles.container}>
      <div className={styles.notice}>
        <InformationIcon />
        <p className={styles.notice__description}>
          {content}
        </p>
        <button
          type="button"
          className={styles['close-button']}
          onClick={handleDismissNotice}
          aria-label="공지 닫기"
        >
          <CloseIcon aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
