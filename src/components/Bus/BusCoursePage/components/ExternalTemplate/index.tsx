import { BUS_TYPES } from 'static/bus';
import styles from './ExternalTemplate.module.scss';

export default function Template({ typeNumber, arrivalList }: { typeNumber: number; arrivalList: string[][] }) {
  return (
    <div className={styles.timetable} aria-expanded="true">
      <div className={styles['timetable__label-wrapper']}>
        <div className={styles.timetable__label}>{BUS_TYPES[typeNumber].tableHeaders[0]}</div>
        <div className={styles.timetable__label}>{BUS_TYPES[typeNumber].tableHeaders[1]}</div>
      </div>
      {arrivalList.map(([arrival, time], idx) => (
        <div className={styles.timetable__row} key={`${arrival} - ${time} - ${idx}`}>
          <span className={styles.timetable__cell_am}>{arrival}</span>
          <span className={styles.timetable__cell_pm}>{time}</span>
        </div>
      ))}
    </div>
  );
}
