import useBusNoticeInfo from 'pages/BusTimetablePage/hooks/useBusNoticeInfo';
import InfoIcon from 'assets/svg/info.svg';
import Close from 'assets/svg/close.svg';
import BusTimetable from './BusTimetable';
import styles from './BusTimetablePage.module.scss';

function BusTimeTablePage() {
  const { busNoticeInfo } = useBusNoticeInfo();

  return (
    <main className={styles.container}>
      <header>
        <h1 className={styles.title}>버스 시간표</h1>
        <div className={styles['sub-title']}>
          어디를 가시나요?
          <br />
          운행수단별로 간단히 비교해드립니다.
        </div>
      </header>

      <div className={styles['notion-info']}>
        <InfoIcon />
        <div className={styles['notion-info__info-title']}>
          {busNoticeInfo?.title}
        </div>
        <Close />

      </div>
      <BusTimetable />

    </main>
  );
}

export default BusTimeTablePage;
