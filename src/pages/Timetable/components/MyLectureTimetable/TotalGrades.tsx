import { LectureInfo, TimetableLectureInfo } from 'interfaces/Lecture';
import styles from './MyLectureTimetable.module.scss';

function TotalGrades(props: { myLectureList: TimetableLectureInfo[] | LectureInfo[] }) {
  let total = 0;
  // eslint-disable-next-line react/destructuring-assignment
  props.myLectureList.forEach((item) => {
    total += parseInt(item.grades, 10);
  });

  return (
    <div className={styles.grades}>
      <div className={styles.grades__number}>{total}</div>
      학점
    </div>
  );
}

export default TotalGrades;
