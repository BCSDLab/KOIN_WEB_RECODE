import { CallvanPost } from 'api/callvan/entity';
import PeopleIcon from 'assets/svg/Callvan/people.svg';
import PhoneCallingIcon from 'assets/svg/Callvan/phone-calling.svg';
import RouteIndicatorIcon from 'assets/svg/Callvan/route-indicator.svg';
import CloseConfirmModal from 'components/Callvan/components/CloseConfirmModal';
import useCloseCallvan from 'components/Callvan/hooks/useCloseCallvan';
import useCompleteCallvan from 'components/Callvan/hooks/useCompleteCallvan';
import useReopenCallvan from 'components/Callvan/hooks/useReopenCallvan';
import { DAYS } from 'static/day';
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
  const [isCloseModalOpen, openCloseModal, closeCloseModal] = useBooleanState(false);
  const { mutate: closePost } = useCloseCallvan();
  const { mutate: reopenPost } = useReopenCallvan();
  const { mutate: completePost } = useCompleteCallvan();

  const handleCloseConfirm = () => {
    closePost(post.id);
    closeCloseModal();
  };

  const renderTopAction = () => {
    if (post.is_author && post.status !== 'COMPLETED') {
      return (
        <span className={styles.card__phone}>
          <PhoneCallingIcon />
        </span>
      );
    }
    return <span className={styles['card__phone-placeholder']} />;
  };

  const renderActionButton = () => {
    if (post.status === 'RECRUITING') {
      if (post.is_author) {
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
      return (
        <button type="button" className={styles['card__badge--recruiting']} aria-label="참여하기">
          참여하기
        </button>
      );
    }

    if (post.status === 'CLOSED' && post.is_author) {
      return (
        <div className={styles['card__badge-group']}>
          <button
            type="button"
            className={styles['card__badge--reopen']}
            onClick={() => reopenPost(post.id)}
            aria-label="재모집"
          >
            재모집
          </button>
          <button
            type="button"
            className={styles['card__badge--complete']}
            onClick={() => completePost(post.id)}
            aria-label="이용완료"
          >
            이용완료
          </button>
        </div>
      );
    }

    return (
      <button type="button" className={styles['card__badge--closed']} disabled aria-label="모집마감">
        모집마감
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
              <div className={styles.card__count}>
                <PeopleIcon />
                <span>
                  {post.current_participants}/{post.max_participants}
                </span>
              </div>
            </div>
          </div>
          <div className={styles.card__actions}>
            {renderTopAction()}
            {renderActionButton()}
          </div>
        </div>
      </div>
      {isCloseModalOpen && <CloseConfirmModal onConfirm={handleCloseConfirm} onCancel={closeCloseModal} />}
    </>
  );
}
