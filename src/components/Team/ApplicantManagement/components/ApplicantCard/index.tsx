import Link from 'next/link';
import { cn } from '@bcsdlab/utils';
import ChatBubbleIcon from 'assets/svg/Team/chat-bubble.svg';
import ChevronRightIcon from 'assets/svg/Team/chevron-right-icon.svg';
import ProfileAvatarIcon from 'assets/svg/Team/profile-avatar-icon.svg';
import formatApplicationStatus from 'components/Team/utils/formatApplicationStatus';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import showToast from 'utils/ts/showToast';
import type { TeamRecruitmentApplicant } from 'api/team/entity';
import styles from './ApplicantCard.module.scss';

const STATUS_CLASS: Record<TeamRecruitmentApplicant['status'], string> = {
  PENDING: 'card__status--pending',
  ACCEPTED: 'card__status--accepted',
  REJECTED: 'card__status--rejected',
};

const formatStudentYear = (studentYear: number) => `${String(studentYear).slice(-2)}학번`;

interface ApplicantCardProps {
  applicant: TeamRecruitmentApplicant;
  recruitmentId: string;
}

export default function ApplicantCard({ applicant, recruitmentId }: ApplicantCardProps) {
  const logger = useLogger();
  const { nickname, department, student_year: studentYear, role, status, can_open_direct_chat: canOpenDirectChat } =
    applicant;

  const handleCardClick = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'team_recruitment_created_post_applicant_select',
      value: '지원자 선택',
    });
  };

  const handleChatClick = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'team_recruitment_created_post_applicant_chat',
      value: '채팅',
    });
    // TODO: 다이렉트 채팅방 개설/조회 API 연결 후 실제 채팅방으로 라우팅하도록 교체
    showToast('warning', '준비 중인 기능입니다.');
  };

  return (
    <div className={styles.card}>
      <Link
        href={ROUTES.TeamRecruitmentApplicantDetail({
          postId: recruitmentId,
          applicantId: String(applicant.application_id),
        })}
        className={styles.card__overlayLink}
        onClick={handleCardClick}
        aria-label={`${nickname}님 지원자 상세 보기`}
      />

      <div className={styles.card__avatar}>
        <ProfileAvatarIcon />
      </div>

      <div className={styles.card__body}>
        <div className={styles.card__nameRow}>
          <span className={styles.card__name}>{nickname}님</span>
          <span className={cn({ [styles.card__status]: true, [styles[STATUS_CLASS[status]]]: true })}>
            · {formatApplicationStatus(status)}
          </span>
          {canOpenDirectChat && (
            <button type="button" className={styles.card__chat} onClick={handleChatClick} aria-label="지원자와 채팅하기">
              <ChatBubbleIcon aria-hidden />
            </button>
          )}
        </div>

        <p className={styles.card__meta}>
          {role && (
            <>
              <span className={styles.card__role}>{role.name}</span> |{' '}
            </>
          )}
          {department} · {formatStudentYear(studentYear)}
        </p>
      </div>

      <ChevronRightIcon className={styles.card__chevron} aria-hidden />
    </div>
  );
}
