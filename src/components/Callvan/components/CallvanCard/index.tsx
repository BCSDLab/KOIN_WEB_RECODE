import { useRouter } from 'next/router';
import { cn } from '@bcsdlab/utils';
import { CallvanPost } from 'api/callvan/entity';
import ChatIcon from 'assets/svg/Callvan/chat.svg';
import ChevronRightIcon from 'assets/svg/Callvan/chevron-right.svg';
import PeopleIcon from 'assets/svg/Callvan/people.svg';
import PhoneCallingIcon from 'assets/svg/Callvan/phone-calling.svg';
import RouteIndicatorIcon from 'assets/svg/Callvan/route-indicator.svg';
import CloseConfirmModal from 'components/Callvan/components/CloseConfirmModal';
import CompleteConfirmModal from 'components/Callvan/components/CompleteConfirmModal';
import ReopenConfirmModal from 'components/Callvan/components/ReopenConfirmModal';
import useCancelCallvan from 'components/Callvan/hooks/useCancelCallvan';
import useCloseCallvan from 'components/Callvan/hooks/useCloseCallvan';
import useCompleteCallvan from 'components/Callvan/hooks/useCompleteCallvan';
import useJoinCallvan from 'components/Callvan/hooks/useJoinCallvan';
import useReopenCallvan from 'components/Callvan/hooks/useReopenCallvan';
import { DAYS } from 'static/day';
import ROUTES from 'static/routes';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import styles from './CallvanCard.module.scss';

interface CallvanCardProps {
  post: CallvanPost;
}

function getDayOfWeek(dateStr: string): string {
  const date = new Date(dateStr);
  return DAYS[date.getDay()];
}

function formatDate(dateStr: string): string {
  const parts = dateStr.split('-');
  const month = parts[1];
  const day = parts[2];
  const dayOfWeek = getDayOfWeek(dateStr);
  return `${month}.${day} (${dayOfWeek})`;
}

function formatTime(timeStr: string): string {
  return timeStr.slice(0, 5);
}

export default function CallvanCard({ post }: CallvanCardProps) {
  const router = useRouter();
  const [isCloseModalOpen, openCloseModal, closeCloseModal] = useBooleanState(false);
  const [isReopenModalOpen, openReopenModal, closeReopenModal] = useBooleanState(false);
  const [isCompleteModalOpen, openCompleteModal, closeCompleteModal] = useBooleanState(false);

  const { mutate: closePost } = useCloseCallvan();
  const { mutate: reopenPost } = useReopenCallvan();
  const { mutate: completePost } = useCompleteCallvan();
  const { mutate: joinPost, isPending: isJoinPending } = useJoinCallvan();
  const { mutate: cancelPost } = useCancelCallvan();

  const handleCloseConfirm = () => {
    closePost(post.id);
    closeCloseModal();
  };

  const handleReopenConfirm = () => {
    reopenPost(post.id);
    closeReopenModal();
  };

  const handleCompleteConfirm = () => {
    completePost(post.id);
    closeCompleteModal();
  };

  const handleChatClick = () => {
    router.push(ROUTES.CallvanChat({ id: String(post.id) }));
  };

  const renderTopAction = () => {
    if (post.is_author && post.status !== 'COMPLETED') {
      return (
        <span className={styles.card__phone}>
          <PhoneCallingIcon />
        </span>
      );
    }
    if (post.is_joined && !post.is_author) {
      return (
        <button
          type="button"
          className={styles['card__chat-button']}
          onClick={handleChatClick}
          aria-label="채팅하기"
        >
          <ChatIcon />
        </button>
      );
    }
    return <span className={styles['card__phone-placeholder']} />;
  };

  const renderCount = () => {
    if (post.is_author) {
      return (
        <button
          type="button"
          className={styles['card__count--author']}
          onClick={handleChatClick}
          aria-label="그룹 채팅 입장"
        >
          <PeopleIcon />
          <span>
            {post.current_participants}/{post.max_participants}
          </span>
          <ChevronRightIcon />
        </button>
      );
    }
    return (
      <div className={styles.card__count}>
        <PeopleIcon />
        <span>
          {post.current_participants}/{post.max_participants}
        </span>
      </div>
    );
  };

  const renderActionButton = () => {
    if (post.is_author) {
      if (post.status === 'RECRUITING') {
        return (
          <button
            type="button"
            className={styles['card__badge--closeable']}
            onClick={openCloseModal}
            aria-label="마감하기"
          >
            마감하기
          </button>
        );
      }
      if (post.status === 'CLOSED') {
        return (
          <div className={styles['card__badge-group']}>
            <button type="button" className={styles['card__badge--reopen']} onClick={openReopenModal} aria-label="재모집">
              재모집
            </button>
            <button
              type="button"
              className={styles['card__badge--complete']}
              onClick={openCompleteModal}
              aria-label="이용완료"
            >
              이용완료
            </button>
          </div>
        );
      }
      return null;
    }

    if (post.status === 'CLOSED') {
      return (
        <button type="button" className={styles['card__badge--closed']} disabled aria-label="모집마감">
          모집마감
        </button>
      );
    }

    if (post.is_joined) {
      return (
        <button type="button" className={styles['card__badge--joined']} onClick={() => cancelPost(post.id)} aria-label="참여취소">
          참여취소
        </button>
      );
    }

    return (
      <button
        type="button"
        className={cn({
          [styles['card__badge--recruiting']]: !isJoinPending,
          [styles['card__badge--pending']]: isJoinPending,
        })}
        onClick={() => joinPost(post.id)}
        disabled={isJoinPending}
        aria-label="참여하기"
      >
        참여하기
      </button>
    );
  };

  return (
    <>
      <div className={styles.card}>
        <div className={styles.card__inner}>
          <div className={styles.card__content}>
            <div className={styles['card__text-card']}>
              <div className={styles.card__indicator}>
                <RouteIndicatorIcon />
              </div>
              <div className={styles['card__main-text']}>
                <div className={styles.card__location}>
                  <span className={styles['card__location-label']}>출발:</span>
                  <span className={styles['card__location-value']}>{post.departure}</span>
                </div>
                <div className={styles.card__location}>
                  <span className={styles['card__location-label']}>도착:</span>
                  <span className={styles['card__location-value']}>{post.arrival}</span>
                </div>
              </div>
            </div>
            <div className={styles['card__sub-text']}>
              <div className={styles['card__date-time']}>
                <span>{formatDate(post.departure_date)}</span>
                <span>{formatTime(post.departure_time)}</span>
              </div>
              <span className={styles.card__divider}>|</span>
              {renderCount()}
            </div>
          </div>
          <div className={styles.card__actions}>
            {renderTopAction()}
            {renderActionButton()}
          </div>
        </div>
      </div>
      {isCloseModalOpen && <CloseConfirmModal onConfirm={handleCloseConfirm} onCancel={closeCloseModal} />}
      {isReopenModalOpen && <ReopenConfirmModal onConfirm={handleReopenConfirm} onCancel={closeReopenModal} />}
      {isCompleteModalOpen && <CompleteConfirmModal onConfirm={handleCompleteConfirm} onCancel={closeCompleteModal} />}
    </>
  );
}
