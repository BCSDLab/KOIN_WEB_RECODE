import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@bcsdlab/utils';
import InformationIcon from 'assets/svg/common/information/information-icon.svg';
import CloseIcon from 'assets/svg/common/close/close-icon-32x32.svg';
import useBusNotice from 'pages/Bus/components/BusNotice/hooks/useBusNotice';
import styles from './BusNotice.module.scss';

export default function BusNotice() {
  const navigate = useNavigate();
  const { id, title } = useBusNotice().data;
  const lastBusNotice = localStorage.getItem('lastBusNotice');
  const busNoticeDismissed = JSON.parse(localStorage.getItem('busNoticeDismissed') || 'false');
  const isUpdated = lastBusNotice !== title;

  if (isUpdated) {
    localStorage.setItem('lastBusNotice', title);
    localStorage.setItem('busNoticeDismissed', 'false');
  }

  const [showNotice, setShowNotice] = useState(() => !busNoticeDismissed || isUpdated);

  const handleClickNavigateNotice = () => {
    navigate(`/board/notice/${id}`);
  };

  const handleClickDismissNotice = () => {
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
          <button
            type="button"
            className={styles['removable-notice__description']}
            onClick={handleClickNavigateNotice}
          >
            {title}
          </button>
          <button
            type="button"
            className={styles['close-button']}
            onClick={handleClickDismissNotice}
            aria-label="공지 닫기"
          >
            <CloseIcon aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
