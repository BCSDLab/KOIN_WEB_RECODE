import SleepingPlanet from 'assets/svg/Callvan/sleeping-planet.svg';
import styles from './NotificationEmptyState.module.scss';

export default function NotificationEmptyState() {
  return (
    <div className={styles.empty}>
      <div className={styles.empty__icon}>
        <SleepingPlanet />
      </div>
      <div>
        <p className={styles.empty__title}>아직 알림이 없어요</p>
        <p className={styles.empty__subtitle}>콜밴팟 관련 알림이 오면 여기에 표시돼요</p>
      </div>
    </div>
  );
}
