import { BUS_TYPES } from 'static/bus';
import styles from './ExternalTemplate.module.scss';

export default function Template({ typeNumber, arrivalList }: { typeNumber: number; arrivalList: string[][] }) {
  const isEmpty = arrivalList.length === 0;

  return (
    <div className={styles.timetable} aria-expanded="true">
      <div className={styles['timetable-label']}>
        <div className={styles['timetable-label__text']}>{BUS_TYPES[typeNumber].tableHeaders[0]}</div>
        <div className={styles['timetable-label__text']}>{BUS_TYPES[typeNumber].tableHeaders[1]}</div>
      </div>
      {isEmpty ? (
        <div className={styles['timetable-exception']}>운행 정보가 없습니다.</div>
      ) : (
        arrivalList.map(([arrival, time], idx) => (
          <div className={styles['timetable-content']} key={`${arrival} - ${time} - ${idx}`}>
            <span className={styles['timetable-content__am']}>{arrival}</span>
            <span className={styles['timetable-content__pm']}>{time}</span>
          </div>
        ))
      )}
    </div>
  );
}
