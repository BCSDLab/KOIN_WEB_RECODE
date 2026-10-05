// 프론트 알림 미구현으로 인한 관련 코드 주석 처리
import Link from 'next/link';
import BbicoIcon from 'assets/svg/common/bbico-icon.svg';
import KoinTitleIcon from 'assets/svg/common/koin-title-icon.svg';
// import NotificationBellIcon from 'assets/svg/common/notification-icon.svg';
// import useLogger from 'utils/hooks/analytics/useLogger';
import styles from './MobileHomeRedesignHeader.module.scss';

function MobileHomeRedesignHeader() {
  // const logger = useLogger();

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.header__brand}>
        <BbicoIcon aria-hidden />
        <KoinTitleIcon aria-label="KOIN" />
      </Link>
      {/* <button
        type="button"
        className={styles.header__notification}
        aria-label="알림"
        onClick={() =>
          logger.actionEventClick({
            team: 'CAMPUS',
            event_label: 'notification',
            value: '알림 아이콘',
          })
        }
      >
        <NotificationBellIcon aria-hidden />
      </button> */}
    </header>
  );
}

export default MobileHomeRedesignHeader;
