import { cn } from '@bcsdlab/utils';
import InformationIcon from 'assets/svg/Bus/information-icon.svg';
import CloseIcon from 'assets/svg/common/close/close-icon-32x32.svg';
import { useState } from 'react';
import styles from './BusNotice.module.scss';

interface BusNoticeProps {
  isSearching: boolean,
}

export default function BusNotice({ isSearching }: BusNoticeProps) {
  const [showNotice, setShowNotice] = useState(() => localStorage.getItem('noticeDismissed') !== 'true');
  const content = '[긴급] 9.27(금) 대학등교방향 천안셔틀버스 터미널 미정차 알림(천안역에서 승차바람)';

  const handleDismissNotice = () => {
    localStorage.setItem('noticeDismissed', 'true');
    setShowNotice(false);
  };

  if (!showNotice) return null;

  return (
    <div
      className={cn({
        [styles.container]: true,
        [styles['container--searching']]: isSearching,
      })}
    >
      {showNotice && !isSearching && (
        <div className={styles['removable-notice']}>
          <InformationIcon />
          <p className={styles['removable-notice__description']}>
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
      )}
    </div>
  );
}
