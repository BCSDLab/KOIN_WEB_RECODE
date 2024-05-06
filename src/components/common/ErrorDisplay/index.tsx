import styles from './ErrorDisplay.module.scss';

export default function ErrorDisplay() {
  return (
    <div className={styles.display}>
      <img className={styles.display__image} src="https://static.koreatech.in/assets/img/ic-none.png" alt="" />
      <div className={styles.display__describe}>
        이미지 에러로 인해
        <br />
        표시할 수 없습니다.
      </div>
    </div>
  );
}
