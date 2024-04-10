import { ReactComponent as UpdateIcon } from 'assets/svg/update-icon.svg';
import styles from './UpdateInfo.module.scss';

interface UpdateInfoProps {
  date: string | null;
}

function UpdateInfo({ date }: UpdateInfoProps) {
  // 날짜 형식을 YYYY.MM.DD로 변경
  const formattedDate = date ? date.replace(/-/g, '.') : null;

  return (
    <div className={styles.update}>
      {date
        ? (
          <div className={styles['update--box']}>
            <UpdateIcon />
            <div className={styles['update--text']}>{`${formattedDate} 업데이트`}</div>
          </div>
        )

        : '최근 업데이트 정보 없음'}
    </div>
  );
}

export default UpdateInfo;
