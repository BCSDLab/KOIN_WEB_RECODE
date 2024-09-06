import { ReactComponent as TimetableIcon } from 'assets/svg/timetable-icon.svg';
import styles from './TimetableHeader.module.scss';

export default function TimetableHeader() {
  return (
    <div className={styles.timetable}>
      <TimetableIcon className={styles.timetable__icon} />
      <h1 className={styles.timetable__title}>시간표</h1>
    </div>
  );
}
