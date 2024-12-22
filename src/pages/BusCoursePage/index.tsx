import useBusNoticeInfo from 'pages/BusCoursePage/hooks/useBusNoticeInfo';
import InfoIcon from 'assets/svg/info.svg';
import Close from 'assets/svg/close.svg';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import { useState } from 'react';
import BusTimetable from './BusTimetable';
import styles from './BusCoursePage.module.scss';

function BusCoursePage() {
  const { busNoticeInfo } = useBusNoticeInfo();
  const [isTooltipVisible, setIsTooltipVisible] = useState(true);
  const isMobile = useMediaQuery();

  return (
    <main className={styles.container}>
      {isMobile ? (
        <header className={styles['mobile-title']}>
          <div className={styles['mobile-title__text']}>
            셔틀버스 시간표
          </div>

        </header>
      ) : (
        <header className={styles['title-container']}>
          <h1 className={styles.title}>버스 시간표</h1>
          <div className={styles['sub-title']}>
            어디를 가시나요?
            <br />
            운행수단별로 간단히 비교해드립니다.
          </div>
        </header>
      )}

      {isTooltipVisible ? (
        <div className={styles['notion-info']}>
          <InfoIcon />
          {busNoticeInfo?.title ? (
            <div className={styles['notion-info__info-title']}>
              {busNoticeInfo.title.length > 30
                ? `${busNoticeInfo.title.slice(0, 30)}...`
                : busNoticeInfo.title}
            </div>
          ) : (
            <div className={styles['notion-info__placeholder']} />
          )}
          <button
            type="button"
            className={styles['close-button']}
            aria-label="Close Button"
            onClick={() => setIsTooltipVisible(false)}
          >
            <Close />
          </button>
        </div>
      ) : (
        <div className={styles['notion-info-closed']}>
          <div
            className={styles['notion-info-closed__button']}
          />
        </div>

      )}

      <BusTimetable />
    </main>
  );
}

export default BusCoursePage;
