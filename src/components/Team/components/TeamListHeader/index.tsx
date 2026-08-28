import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { teamQueries } from 'api/team/queries';
import ArrowBackIcon from 'assets/svg/Team/arrow-back.svg';
import NotificationIcon from 'assets/svg/Team/notification.svg';
import ProfileIcon from 'assets/svg/Team/profile.svg';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMount from 'utils/hooks/state/useMount';
import useTokenState from 'utils/hooks/state/useTokenState';

import styles from './TeamListHeader.module.scss';

export default function TeamListHeader() {
  const router = useRouter();
  const token = useTokenState();
  const isMounted = useMount();
  const logger = useLogger();

  const { data: notificationData } = useQuery({
    ...teamQueries.notifications(token ?? '', { limit: 1 }),
    enabled: !!token,
  });

  const hasUnreadNotifications = isMounted && (notificationData?.unread_count ?? 0) > 0;

  const handleBack = () => {
    if (window.history.state?.idx === 0) {
      router.push(ROUTES.Main());
      return;
    }

    router.back();
  };

  const handleNotificationsClick = () => {
    logger.actionEventClick({ team: 'CAMPUS', event_label: 'team_recruitment_notification', value: '알림' });
    router.push(ROUTES.TeamNotifications());
  };

  return (
    <header className={styles.header}>
      <button type="button" className={styles['header__back-button']} aria-label="뒤로가기" onClick={handleBack}>
        <ArrowBackIcon />
      </button>

      <h1 className={styles.header__title}>팀원모집</h1>

      <div className={styles.header__actions}>
        <button
          type="button"
          className={styles['header__icon-button']}
          aria-label="알림"
          onClick={handleNotificationsClick}
        >
          <NotificationIcon />
          {hasUnreadNotifications && <span className={styles['header__notification-dot']} />}
        </button>

        <button
          type="button"
          className={styles['header__icon-button']}
          aria-label="프로필"
          onClick={() => router.push(ROUTES.TeamProfile())}
        >
          <ProfileIcon />
        </button>
      </div>
    </header>
  );
}
