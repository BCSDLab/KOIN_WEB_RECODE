import { CallvanPost } from 'api/callvan/entity';
import PeopleIcon from 'assets/svg/Callvan/people.svg';
import RouteIndicatorIcon from 'assets/svg/Callvan/route-indicator.svg';
import styles from './CallvanCard.module.scss';

interface CallvanCardProps {
  post: CallvanPost;
}

function getDayOfWeek(dateStr: string): string {
  const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
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
  const isClosed = post.status !== 'RECRUITING';

  return (
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
          <button
            type="button"
            className={isClosed ? styles['card__badge--closed'] : styles['card__badge--recruiting']}
            aria-label={isClosed ? '모집마감' : '참여하기'}
          >
            {isClosed ? '모집마감' : '참여하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
