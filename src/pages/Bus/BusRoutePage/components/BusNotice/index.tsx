import { useState } from 'react';
import { cn } from '@bcsdlab/utils';
import InformationIcon from 'assets/svg/Bus/information-icon.svg';
import CloseIcon from 'assets/svg/common/close/close-icon-32x32.svg';
import useBusNotice from 'pages/Bus/BusRoutePage/hooks/useBusNotice';
import styles from './BusNotice.module.scss';

export default function BusNotice() {
  const res = useBusNotice();
  const { title } = res.data;
  const lastBusNotice = localStorage.getItem('lastBusNotice');
  const busNoticeDismissed = JSON.parse(localStorage.getItem('busNoticeDismissed') || 'false');
  const isUpdated = lastBusNotice !== title;

  if (isUpdated) {
    localStorage.setItem('lastBusNotice', title);
    localStorage.setItem('busNoticeDismissed', 'false');
  }

  const [showNotice, setShowNotice] = useState(() => !busNoticeDismissed || isUpdated);

  const handleDismissNotice = () => {
    localStorage.setItem('busNoticeDismissed', 'true');
    setShowNotice(false);
  };

  if (!showNotice) return null;

  return (
    <div
      className={cn({
        [styles.container]: true,
        // [styles['container--searching']]: isSearching,
      })}
    >
      {showNotice && (
        <div className={styles['removable-notice']}>
          <InformationIcon />
          <span className={styles['removable-notice__description']}>
            {title}
          </span>
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
