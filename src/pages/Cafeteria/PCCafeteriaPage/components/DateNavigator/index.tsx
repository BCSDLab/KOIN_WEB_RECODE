import styles from './DateNavigator.module.scss';

const WEEK = [
  '일', '월', '화', '수', '목', '금', '토',
];

export default function DateNavigator() {
  return (
    <div className={styles.container}>
      <div className={styles.date}>
        <span>{'<'}</span>
        <span>오늘</span>
        <span>{'>'}</span>
      </div>
      <div className={styles.week}>
        {WEEK.map((day) => (
          <span key={day} className={styles.week__day}>{day}</span>
        ))}
      </div>
    </div>
  );
}
