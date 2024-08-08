import { LectureInfo, TimetableLectureInfo } from 'interfaces/Lecture';
import styles from './MyLectureTimetable.module.scss';

interface TotalGradesProps {
  myLectureList: TimetableLectureInfo[] | LectureInfo[];
}

function TotalGrades({ myLectureList }: TotalGradesProps) {
  const lectureList = myLectureList as (TimetableLectureInfo | LectureInfo)[];
  const total = lectureList.reduce((acc, lecture) => acc + Number(lecture.grades), 0);

  return (
    <div className={styles.grades}>
      <div className={styles.grades__number}>{total}</div>
      학점
    </div>
  );
}

export default TotalGrades;
