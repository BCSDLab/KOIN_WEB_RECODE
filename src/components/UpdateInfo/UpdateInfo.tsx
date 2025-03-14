import UpdateIcon from 'assets/svg/update-icon.svg';
import styles from './UpdateInfo.module.scss';

interface UpdateInfoProps {
  date: string | null;
}

function UpdateInfo({ date }: UpdateInfoProps) {
  return (
    <div className={styles.update}>
      {date
        ? (
          <div className={styles['update--box']}>
            <UpdateIcon />
            <div className={styles['update--text']}>{`${date.replace(/-/g, '.')} 업데이트`}</div>
          </div>
        )

        : '최근 업데이트 정보 없음'}
    </div>
  );
}

export default UpdateInfo;
