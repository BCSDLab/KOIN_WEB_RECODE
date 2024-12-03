import InformationIcon from 'assets/svg/Bus/information-icon.svg';
import CloseIcon from 'assets/svg/common/close/close-icon-32x32.svg';
import styles from './BusNotice.module.scss';

export default function BusNotice() {
  return (
    <div className={styles.container}>
      <div className={styles.notice}>
        <InformationIcon />
        <p className={styles.notice__description}>
          [긴급] 9.27(금) 대학등교방향 천안셔틀버스 터미널 미정차 알림(천안역에서 승차바람)
        </p>
        <CloseIcon />
      </div>
    </div>
  );
}
