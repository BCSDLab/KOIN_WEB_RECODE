import type { TeamRecruitmentNotification, TeamRecruitmentNotificationType } from 'api/team/entity';

const NOTIFICATION_TITLE: Record<TeamRecruitmentNotificationType, string> = {
  NEW_APPLICATION: '팀원모집 새 지원',
  APPLICATION_ACCEPTED: '팀원모집 지원 승인',
  APPLICATION_REJECTED: '팀원모집 지원 거절',
  RECRUITMENT_CLOSED: '팀원모집 기간 종료',
  RECRUITMENT_DELETED: '팀원모집 글 삭제',
  NEW_CHAT_MESSAGE: '팀원모집 새 메시지',
};

const getNotificationTitle = (notification: TeamRecruitmentNotification) => {
  if (notification.type === 'NEW_CHAT_MESSAGE' && notification.sender_nickname) {
    return `팀원모집 ${notification.sender_nickname}님의 메시지`;
  }

  return NOTIFICATION_TITLE[notification.type];
};

export default getNotificationTitle;
