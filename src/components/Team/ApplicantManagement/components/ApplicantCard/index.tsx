import Link from 'next/link';
import { useRouter } from 'next/router';
import { cn } from '@bcsdlab/utils';
import { useMutation } from '@tanstack/react-query';
import { teamMutations } from 'api/team/mutations';
import ChatBubbleIcon from 'assets/svg/Team/chat-bubble.svg';
import ChevronRightIcon from 'assets/svg/Team/chevron-right-icon.svg';
import ProfileAvatarIcon from 'assets/svg/Team/profile-avatar-icon.svg';
import formatApplicationStatus from 'components/Team/utils/formatApplicationStatus';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useTokenState from 'utils/hooks/state/useTokenState';
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
  const router = useRouter();
  const token = useTokenState();
  const logger = useLogger();
  const isMobile = useMediaQuery();
  const { nickname, department, student_year: studentYear, role, status, can_open_direct_chat: canOpenDirectChat } =
    applicant;

  const { mutate: createDirectChatRoom, isPending: isCreatingChat } = useMutation(
    teamMutations.createDirectChatRoom(token, Number(recruitmentId)),
  );

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
    createDirectChatRoom(applicant.application_id, {
      onSuccess: (chatRoom) => {
        router.push(ROUTES.TeamChat({ recruitmentId, chatRoomId: String(chatRoom.chat_room_id) }));
      },
    });
  };

  const chatButton = canOpenDirectChat && (
    <button
      type="button"
      className={styles.card__chat}
      onClick={handleChatClick}
      disabled={isCreatingChat}
      aria-label="지원자와 채팅하기"
    >
      <ChatBubbleIcon aria-hidden />
    </button>
  );

  const statusLabel = (
    <span className={cn({ [styles.card__status]: true, [styles[STATUS_CLASS[status]]]: true })}>
      {isMobile && '· '}
      {formatApplicationStatus(status)}
    </span>
  );

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

          {isMobile ? (
            <>
              {statusLabel}
              {chatButton}
            </>
          ) : (
            <div className={styles.card__trailing}>
              {chatButton}
              {statusLabel}
            </div>
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

      {isMobile && <ChevronRightIcon className={styles.card__chevron} aria-hidden />}
    </div>
  );
}
