import styles from './Cafeteria.module.scss';

const CAFETERIA_LIST = ["한식","일품","양식","특식"];

function Cafeteria() {
  return (
    <div className={styles.template}>
      <div className={styles.title}>
        오늘의 식단
      </div>
      <div className={styles.date}>
        <span className={styles.date__prev} />
        <span className={styles.date__now}>
          {/* 2023년 3월 5일 */}
        </span>
        <span className={styles.date__next} />
      </div>
    </div>
  )
}

export default Cafeteria;