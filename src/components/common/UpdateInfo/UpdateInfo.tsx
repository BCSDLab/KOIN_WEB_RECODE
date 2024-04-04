import styles from './UpdateInfo.module.scss';

interface UpdateInfoProps {
  date : string | null
}

function UpdateInfo({ date } :UpdateInfoProps) {
  return (
    <div className={styles.update}>
      <span className={styles['update--content']}>{date ? '최근 업데이트일' : '최근 업데이트 정보 없음'}</span>
      <span className={styles['update--info']}>{date}</span>
    </div>
  );
}

export default UpdateInfo;
