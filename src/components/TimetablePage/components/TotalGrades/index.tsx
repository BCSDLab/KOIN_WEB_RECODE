import { useEffect, useState } from 'react';
import { Lecture, MyLectureInfo } from 'api/timetable/entity';
import styles from './TotalGrades.module.scss';

interface TotalGradesProps {
  myLectureList: Lecture[] | MyLectureInfo[] | undefined;
}

function TotalGrades({ myLectureList = [] }: TotalGradesProps) {
  const [totalGrades, setTotalGrades] = useState(0);

  useEffect(() => {
    let sum = 0;
    myLectureList.forEach((item) => {
      sum += Number(item.grades);
    });
    setTotalGrades(sum);
  }, [myLectureList]);

  return (
    <div className={styles.grades}>
      <div className={styles.grades__number}>{totalGrades}</div>
      학점
    </div>
  );
}

export default TotalGrades;
