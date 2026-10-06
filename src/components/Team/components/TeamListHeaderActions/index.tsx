import { useRouter } from 'next/router';

import { useQuery } from '@tanstack/react-query';
import { teamQueries } from 'api/team/queries';
import NotificationIcon from 'assets/svg/Team/notification.svg';
import ProfileIcon from 'assets/svg/Team/profile.svg';
import HeaderIconButton from 'components/ui/PageHeader/HeaderIconButton';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';
import useMount from 'utils/hooks/state/useMount';
import { setRedirectPath } from 'utils/ts/auth';
import showToast from 'utils/ts/showToast';

import styles from './TeamListHeaderActions.module.scss';

export default function TeamListHeaderActions() {
  const router = useRouter();
  const isLoggedIn = useIsLoggedIn();
  const isMounted = useMount();
  const logger = useLogger();

  const { data: notificationData } = useQuery({
    ...teamQueries.notifications(isLoggedIn, { limit: 1 }),
    enabled: isLoggedIn,
  });

  const hasUnreadNotifications = isMounted && (notificationData?.unread_count ?? 0) > 0;

  const handleNotificationsClick = () => {
    logger.actionEventClick({ team: 'CAMPUS', event_label: 'team_recruitment_notification', value: '알림' });
    router.push(ROUTES.TeamNotifications());
  };

  const handleProfileClick = async () => {
    logger.actionEventClick({ team: 'CAMPUS', event_label: 'team_recruitment_profile', value: '프로필' });

    if (!isLoggedIn) {
      setRedirectPath(router.asPath);
      await router.push(ROUTES.Auth());
      showToast('warning', '로그인이 필요한 기능입니다.');

      return;
    }
    router.push(ROUTES.TeamProfile());
  };

  return (
    <div className={styles.actions}>
      <HeaderIconButton className={styles.notification} aria-label="알림" onClick={handleNotificationsClick}>
        <NotificationIcon />
        {hasUnreadNotifications && <span className={styles.notification__dot} />}
      </HeaderIconButton>
      <HeaderIconButton aria-label="프로필" onClick={handleProfileClick}>
        <ProfileIcon />
      </HeaderIconButton>
    </div>
  );
}
