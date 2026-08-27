import ChatIcon from 'assets/svg/Team/chat.svg';
import UserGroupIcon from 'assets/svg/Team/user-group.svg';
import formatRelativeTime from 'components/Team/utils/formatRelativeTime';
import type { TeamRecruitmentNotification, TeamRecruitmentNotificationType } from 'api/team/entity';

import styles from './NotificationCard.module.scss';

const NOTIFICATION_TITLE: Record<TeamRecruitmentNotificationType, string> = {
  NEW_APPLICATION: '팀원 모집 새 지원',
  APPLICATION_ACCEPTED: '팀원 모집 지원 승인',
  APPLICATION_REJECTED: '팀원 모집 지원 거절',
  RECRUITMENT_CLOSED: '팀원 모집기간 종료',
  RECRUITMENT_DELETED: '팀원 모집글 삭제',
  // 디자인은 '팀원모집 @@@님의 메세지'이지만 응답에 닉네임 필드가 없어 우선 고정 문구로 둠. API 요청예정
  NEW_CHAT_MESSAGE: '팀원 모집 새 메세지',
};

interface NotificationCardProps {
  notification: TeamRecruitmentNotification;
  now: Date | null;
  onClick: (notification: TeamRecruitmentNotification) => void;
}

export default function NotificationCard({ notification, now, onClick }: NotificationCardProps) {
  return (
    <button type="button" className={styles.card} onClick={() => onClick(notification)}>
      <span className={styles.card__icon}>
        {notification.type === 'NEW_CHAT_MESSAGE' ? <ChatIcon /> : <UserGroupIcon />}
      </span>

      <span className={styles.card__body}>
        <span className={styles.card__heading}>
          <span className={styles.card__title}>{NOTIFICATION_TITLE[notification.type]}</span>
          <span className={styles.card__time}>{now ? formatRelativeTime(notification.created_at, now) : ''}</span>
        </span>

        <span className={styles.card__message}>{notification.message_preview}</span>
      </span>
    </button>
  );
}
