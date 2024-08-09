import styles from './TotalGrades.module.scss';

function TotalGrades({ grades }: { grades: number | undefined }) {
  return (
    <div className={styles.grades}>
      <div className={styles.grades__number}>{grades}</div>
      학점
    </div>
  );
}

export default TotalGrades;
