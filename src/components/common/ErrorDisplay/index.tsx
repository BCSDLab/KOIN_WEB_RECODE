import styles from './ErrorDisplay.module.scss';

export default function ErrorDisplay() {
  return (
    <div className={styles.noContent}>
      <img className={styles.noImage} src="https://static.koreatech.in/assets/img/ic-none.png" alt="" />
      <div className={styles.noMessage}>
        이미지 에러로 인해
        <br />
        표시할 수 없습니다.
      </div>
    </div>
  );
}
