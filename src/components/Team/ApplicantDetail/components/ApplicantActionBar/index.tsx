import ChatBubbleIcon from 'assets/svg/Team/accept-chat.svg';
import type { TeamApplicationStatus } from 'api/team/entity';
import styles from './ApplicantActionBar.module.scss';

interface ApplicantActionBarProps {
  status: TeamApplicationStatus;
  canDecide: boolean;
  canOpenDirectChat: boolean;
  isSubmitting: boolean;
  isChatPending: boolean;
  onReject: () => void;
  onAccept: () => void;
  onChatClick: () => void;
}

export default function ApplicantActionBar({
  status,
  canDecide,
  canOpenDirectChat,
  isSubmitting,
  isChatPending,
  onReject,
  onAccept,
  onChatClick,
}: ApplicantActionBarProps) {
  if (canDecide) {
    return (
      <div className={styles.bar}>
        <button type="button" className={styles.bar__reject} onClick={onReject} disabled={isSubmitting}>
          거절하기
        </button>
        <button type="button" className={styles.bar__accept} onClick={onAccept} disabled={isSubmitting}>
          승인하기
        </button>
      </div>
    );
  }

  if (status === 'ACCEPTED') {
    return (
      <div className={styles.bar}>
        <button type="button" className={styles.bar__accepted} disabled>
          승인된 지원자
        </button>
        {canOpenDirectChat && (
          <button
            type="button"
            className={styles.bar__chat}
            onClick={onChatClick}
            disabled={isChatPending}
            aria-label="지원자와 채팅하기"
          >
            <ChatBubbleIcon aria-hidden />
          </button>
        )}
      </div>
    );
  }

  if (status === 'REJECTED') {
    return (
      <div className={styles.bar}>
        <button type="button" className={styles.bar__rejected} disabled>
          거절된 지원자
        </button>
      </div>
    );
  }

  return null;
}
