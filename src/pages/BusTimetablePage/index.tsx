import BusTimetable from './BusTimetable';
import styles from './BusTimetablePage.module.scss';

function BusTimeTablePage() {
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

      <BusTimetable />
    </main>
  );
}

export default BusTimeTablePage;
