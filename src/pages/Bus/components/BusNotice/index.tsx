import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import InformationIcon from 'assets/svg/Bus/info.svg';
import CloseIcon from 'assets/svg/common/close/close-icon-32x32.svg';
import useBusNotice from 'pages/Bus/hooks/useBusNotice';
import styles from './BusNotice.module.scss';

export default function BusNotice() {
  const isMobile = useMediaQuery();
  const navigate = useNavigate();
  const res = useBusNotice();
  const { id, title } = res.data;
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
    <div className={styles.container}>
      {showNotice && (
        <div className={styles.notice}>
          {!isMobile && <InformationIcon />}
          <button
            className={styles.notice__description}
            type="button"
            onClick={handleClickNavigateNotice}
          >
            {title}
          </button>
          <button type="button" onClick={handleClickDismissNotice} aria-label="공지 닫기">
            <CloseIcon aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
