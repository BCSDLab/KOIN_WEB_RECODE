import { Lecture, MyLectureInfo } from 'api/timetable/entity';
import styles from './TotalGrades.module.scss';

interface TotalGradesProps {
  myLectureList: Lecture[] | MyLectureInfo[] | undefined;
}

function TotalGrades({ myLectureList = [] }: TotalGradesProps) {
  const totalGrades = myLectureList.reduce((sum, item) => sum + Number(item.grades), 0);

  return (
    <div className={styles.grades}>
      <div className={styles.grades__number}>{totalGrades}</div>
      학점
    </div>
  );
}

export default TotalGrades;
