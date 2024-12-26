import BusNotice from 'pages/Bus/components/BusNotice';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import BusTimetable from './BusTimetable';
import styles from './BusCoursePage.module.scss';

function BusCoursePage() {
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

      <BusNotice />

      <BusTimetable />
    </main>
  );
}

export default BusCoursePage;
