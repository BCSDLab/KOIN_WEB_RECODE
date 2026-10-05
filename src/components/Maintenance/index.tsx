import Error from 'assets/svg/page-not-found-error.svg';
import styles from './Maintenance.module.scss';

export default function MaintenancePage() {
  return (
    <div className={styles.template}>
      <div className={styles['error-icon']}>
        <Error />
      </div>
      <div className={styles.content}>
        <div className={styles.content__title}>점검 중입니다.</div>
        <div className={styles.content__description}>
          죄송합니다. 현재 서버 점검 중 입니다.
          <br />
          최대한 빠르게 오픈하도록 하겠습니다.
        </div>
      </div>
    </div>
  );
}
