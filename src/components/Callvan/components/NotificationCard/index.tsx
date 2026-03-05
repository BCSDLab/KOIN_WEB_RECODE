import { CallvanNotification, CallvanNotificationType } from 'api/callvan/entity';
import NotificationBellRead from 'assets/svg/Callvan/notification-bell-read.svg';
import NotificationBellUnread from 'assets/svg/Callvan/notification-bell-unread.svg';
import PeopleGray from 'assets/svg/Callvan/people-gray.svg';
import PeoplePurple from 'assets/svg/Callvan/people-purple.svg';
import { DAYS } from 'static/day';
import styles from './NotificationCard.module.scss';

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
  onCardClick: (id: number) => void;
}

export default function NotificationCard({ notification, onCardClick }: NotificationCardProps) {
  const isUnread = !notification.is_read;
  const readClass = isUnread ? '--unread' : '--read';

  return (
    <div
      className={styles.card}
      onClick={() => onCardClick(notification.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onCardClick(notification.id)}
    >
      <div className={styles.card__inner}>
        <div className={styles.card__icon}>{isUnread ? <NotificationBellUnread /> : <NotificationBellRead />}</div>
        <div className={styles.card__text}>
          <p className={`${styles.card__title} ${styles[`card__title${readClass}`]}`}>
            {NOTIFICATION_TITLE_MAP[notification.type]}
          </p>
          <div className={styles.card__sub}>
            <span className={`${styles.card__datetime} ${styles[`card__datetime${readClass}`]}`}>
              <span>{formatNotificationDate(new Date(`${notification.departure_date}T00:00:00`).toISOString())}</span>
              <span>{formatDepartureTime(notification.departure_time)}</span>
            </span>
            <span className={`${styles.card__route} ${styles[`card__route${readClass}`]}`}>
              {notification.departure} - {notification.arrival}
            </span>
            <span className={styles.card__count}>
              {isUnread ? <PeoplePurple /> : <PeopleGray />}
              <span className={`${styles['card__count-text']} ${styles[`card__count-text${readClass}`]}`}>
                {notification.current_participants}/{notification.max_participants}
              </span>
            </span>
          </div>
          <p className={`${styles.card__message} ${styles[`card__message${readClass}`]}`}>
            {getNotificationMessage(notification)}
          </p>
        </div>
      </div>
    </div>
  );
}
