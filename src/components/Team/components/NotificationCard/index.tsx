import { cn } from '@bcsdlab/utils';

import ChatIcon from 'assets/svg/Team/chat.svg';
import UserGroupIcon from 'assets/svg/Team/user-group.svg';
import formatRelativeTime from 'components/Team/utils/formatRelativeTime';
import getNotificationTitle from 'components/Team/utils/getNotificationTitle';
import type { TeamRecruitmentNotification } from 'api/team/entity';

import styles from './NotificationCard.module.scss';

interface NotificationCardProps {
  notification: TeamRecruitmentNotification;
  now: Date | null;
  onClick: (notification: TeamRecruitmentNotification) => void;
}

export default function NotificationCard({ notification, now, onClick }: NotificationCardProps) {
  return (
    <button
      type="button"
      className={cn({
        [styles.card]: true,
        [styles['card--read']]: notification.is_read,
      })}
      onClick={() => onClick(notification)}
    >
      <span className={styles.card__icon}>
        {notification.type === 'NEW_CHAT_MESSAGE' ? <ChatIcon /> : <UserGroupIcon />}
      </span>

      <span className={styles.card__body}>
        <span className={styles.card__heading}>
          <span className={styles.card__title}>{getNotificationTitle(notification)}</span>
          <span className={styles.card__time}>{now ? formatRelativeTime(notification.created_at, now) : ''}</span>
        </span>

        <span className={styles.card__message}>{notification.message_preview}</span>
      </span>
    </button>
  );
}
