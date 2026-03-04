import { useCallback, useEffect } from 'react';
import type { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { getCallvanNotifications } from 'api/callvan';
import { CallvanNotification, CallvanNotificationType } from 'api/callvan/entity';
import ArrowBackIcon from 'assets/svg/Callvan/arrow-back.svg';
import NotificationBellRead from 'assets/svg/Callvan/notification-bell-read.svg';
import NotificationBellUnread from 'assets/svg/Callvan/notification-bell-unread.svg';
import PeopleGray from 'assets/svg/Callvan/people-gray.svg';
import PeoplePurple from 'assets/svg/Callvan/people-purple.svg';
import SleepingPlanet from 'assets/svg/Callvan/sleeping-planet.svg';
import ThreeDotsIcon from 'assets/svg/Callvan/three-dots.svg';
import useCallvanNotifications, {
  CALLVAN_NOTIFICATIONS_QUERY_KEY,
} from 'components/Callvan/hooks/useCallvanNotifications';
import MOCK_CALLVAN_NOTIFICATIONS from 'components/Callvan/mocks/callvanNotificationsMock';
import { DAYS } from 'static/day';
import ROUTES from 'static/routes';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useMount from 'utils/hooks/state/useMount';
import { parseServerSideParams } from 'utils/ts/parseServerSideParams';
import styles from './CallvanNotifications.module.scss';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const queryClient = new QueryClient();
  const { token } = parseServerSideParams(context);

  try {
    if (token) {
      await queryClient.prefetchQuery({
        queryKey: [...CALLVAN_NOTIFICATIONS_QUERY_KEY],
        queryFn: () => getCallvanNotifications(token).catch(() => MOCK_CALLVAN_NOTIFICATIONS),
      });
    } else {
      queryClient.setQueryData([...CALLVAN_NOTIFICATIONS_QUERY_KEY], MOCK_CALLVAN_NOTIFICATIONS);
    }
  } catch (error) {
    console.error('[SSR] callvan notifications prefetch failed:', error);
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const NOTIFICATION_TITLE_MAP: Record<CallvanNotificationType, string> = {
  RECRUITMENT_COMPLETE: '콜밴팟 인원 모집 완료',
  NEW_MESSAGE: '새 메시지 도착',
  PARTICIPANT_JOINED: '콜밴팟 인원 참여',
  DEPARTURE_UPCOMING: '콜밴팟 출발 시간 임박',
};

function formatNotificationDate(dateString: string): string {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dayOfWeek = DAYS[date.getDay()];
  return `${month}.${day}(${dayOfWeek})`;
}

function getNotificationMessage(notification: CallvanNotification): string {
  switch (notification.type) {
    case 'RECRUITMENT_COMPLETE':
      return notification.message_preview ?? '해당 콜밴팟 인원이 모두 모집되었어요. 콜밴을 예약할까요?';
    case 'NEW_MESSAGE':
      return `${notification.sender_nickname}: ${notification.message_preview ?? ''}`;
    case 'PARTICIPANT_JOINED':
      return `${notification.joined_member_nickname} 님이 콜밴팟에 참여했어요.`;
    case 'DEPARTURE_UPCOMING':
      return '해당 콜밴팟 출발 시간이 30분 남았어요.';
    default:
      return '';
  }
}

function formatDepartureTime(time: string): string {
  return time.slice(0, 5);
}

interface NotificationCardProps {
  notification: CallvanNotification;
}

function NotificationCard({ notification }: NotificationCardProps) {
  const isUnread = !notification.is_read;
  const readClass = isUnread ? '--unread' : '--read';

  return (
    <div className={styles['notification-page__card']}>
      <div className={styles['notification-page__card-inner']}>
        <div className={styles['notification-page__card-icon']}>
          {isUnread ? <NotificationBellUnread /> : <NotificationBellRead />}
        </div>
        <div className={styles['notification-page__card-text']}>
          <p
            className={`${styles['notification-page__card-title']} ${styles[`notification-page__card-title${readClass}`]}`}
          >
            {NOTIFICATION_TITLE_MAP[notification.type]}
          </p>
          <div className={styles['notification-page__card-sub']}>
            <span
              className={`${styles['notification-page__card-datetime']} ${styles[`notification-page__card-datetime${readClass}`]}`}
            >
              <span>{formatNotificationDate(new Date(`${notification.departure_date}T00:00:00`).toISOString())}</span>
              <span>{formatDepartureTime(notification.departure_time)}</span>
            </span>
            <span
              className={`${styles['notification-page__card-route']} ${styles[`notification-page__card-route${readClass}`]}`}
            >
              {notification.departure} - {notification.arrival}
            </span>
            <span className={styles['notification-page__card-count']}>
              {isUnread ? <PeoplePurple /> : <PeopleGray />}
              <span
                className={`${styles['notification-page__card-count-text']} ${styles[`notification-page__card-count-text${readClass}`]}`}
              >
                {notification.current_participants}/{notification.max_participants}
              </span>
            </span>
          </div>
          <p
            className={`${styles['notification-page__card-message']} ${styles[`notification-page__card-message${readClass}`]}`}
          >
            {getNotificationMessage(notification)}
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className={styles['notification-page__empty']}>
      <div className={styles['notification-page__empty-icon']}>
        <SleepingPlanet />
      </div>
      <div>
        <p className={styles['notification-page__empty-title']}>아직 알림이 없어요</p>
        <p className={styles['notification-page__empty-subtitle']}>콜밴팟 관련 알림이 오면 여기에 표시돼요</p>
      </div>
    </div>
  );
}

export default function CallvanNotificationsPage() {
  const router = useRouter();
  const isMobile = useMediaQuery();
  const mounted = useMount();

  useEffect(() => {
    if (mounted && !isMobile) {
      router.replace(ROUTES.Main());
    }
  }, [mounted, isMobile, router]);

  const { data: notifications } = useCallvanNotifications();

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  if (mounted && !isMobile) {
    return null;
  }

  const hasNotifications = notifications && notifications.length > 0;

  return (
    <div className={styles['notification-page']}>
      <div className={styles['notification-page__header']}>
        <button
          type="button"
          className={styles['notification-page__back-button']}
          onClick={handleBack}
          aria-label="뒤로가기"
        >
          <ArrowBackIcon />
        </button>
        <h1 className={styles['notification-page__title']}>알림</h1>
        {hasNotifications ? (
          <button type="button" className={styles['notification-page__menu-button']} aria-label="더보기">
            <ThreeDotsIcon />
          </button>
        ) : (
          <div style={{ width: 24, height: 24 }} />
        )}
      </div>

      <div className={styles['notification-page__content']}>
        {!hasNotifications ? (
          <EmptyState />
        ) : (
          <div className={styles['notification-page__list']}>
            {notifications.map((notification, index) => (
              <div key={notification.id}>
                <NotificationCard notification={notification} />
                {index < notifications.length - 1 && <div className={styles['notification-page__divider']} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

CallvanNotificationsPage.getLayout = (page: React.ReactNode) => <>{page}</>;
