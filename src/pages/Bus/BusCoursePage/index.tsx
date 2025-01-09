import BusNotice from 'pages/Bus/components/BusNotice';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import styles from './BusCoursePage.module.scss';
import BusTimetable from './components/BusTimetable';

export default function BusCoursePage() {
  const isMobile = useMediaQuery();

  return (
    <main className={styles['root-container']}>
      <div className={styles.container}>
        {isMobile ? (
          <header className={styles['mobile-guide']}>
            <div className={styles['mobile-guide__title']}>셔틀버스 시간표</div>
          </header>
        ) : (
          <header className={styles.guide}>
            <h1 className={styles.guide__title}>버스 시간표</h1>
            <div className={styles.guide__subtitle}>
              어디를 가시나요?
              <br />
              운행수단별로 간단히 비교해드립니다.
            </div>
          </header>
        )}
        <div className={styles.contents}>
          <BusNotice />
          <BusTimetable />
        </div>
      </div>
    </main>
  );
}
