import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import BusTimetable from 'components/Bus/BusCoursePage/components/BusTimetable';
import styles from './BusCoursePage.module.scss';

export default function BusCoursePage() {
  const isMobile = useMediaQuery();

  return (
    <main className={styles['root-container']}>
      <div className={styles.container}>
        {isMobile ? (
          <header className={styles['mobile-guide']}>
            <div className={styles['mobile-guide__title']}>
              셔틀버스 시간표
            </div>
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
          <BusTimetable />
        </div>
      </div>
    </main>
  );
}
