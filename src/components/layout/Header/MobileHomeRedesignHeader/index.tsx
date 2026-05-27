import BbicoIcon from 'assets/svg/common/bbico-icon.svg';
import KoinTitleIcon from 'assets/svg/common/koin-title-icon.svg';
import NotificationBellIcon from 'assets/svg/common/notification-icon.svg';
import styles from './MobileHomeRedesignHeader.module.scss';

function MobileHomeRedesignHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.header__brand}>
        <BbicoIcon aria-hidden />
        <KoinTitleIcon aria-label="KOIN" />
      </div>
      <NotificationBellIcon aria-label="알림" />
    </header>
  );
}

export default MobileHomeRedesignHeader;
