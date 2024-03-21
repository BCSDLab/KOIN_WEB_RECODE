import styles from './UpdateInfo.module.scss';

interface UpdateInfoProps {
  date : string | null
}

function UpdateInfo({ date } :UpdateInfoProps) {
  return (
    <div className={styles.update}>
      <span className={styles['update--content']}>최근 업데이트</span>
      <span className={styles['update--info']}>{date}</span>
    </div>
  );
}

export default UpdateInfo;
