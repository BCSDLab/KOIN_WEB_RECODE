import ActivityMoreIcon from 'assets/svg/Team/activity-more.svg';
import { formatRecruitmentDate } from 'components/Team/utils/recruitmentDisplay';
import type { TeamApplicationActivity } from 'api/team/entity';
import styles from './ActivityHistoryList.module.scss';

interface ActivityHistoryListProps {
  activities: TeamApplicationActivity[];
  onMoreClick: () => void;
  className?: string;
}

const formatPeriod = (activity: TeamApplicationActivity) => {
  const endLabel = activity.is_ongoing ? '진행 중' : formatRecruitmentDate(activity.ended_at ?? '');
  return `${formatRecruitmentDate(activity.started_at)} - ${endLabel}`;
};

export default function ActivityHistoryList({ activities, onMoreClick, className }: ActivityHistoryListProps) {
  const hasMoreActivities = activities.length >= 3;
  const visibleActivities = hasMoreActivities ? activities.slice(0, 3) : activities;

  return (
    <div className={`${styles.list} ${className ?? ''}`}>
      <div className={styles.list__head}>
        <span className={styles.list__label}>활동 이력</span>
        {hasMoreActivities && (
          <button type="button" className={styles.list__more} onClick={onMoreClick}>
            <ActivityMoreIcon aria-hidden />
            <span>더보기</span>
          </button>
        )}
      </div>

      {activities.length === 0 ? (
        <div className={styles.list__box}>
          <p className={styles.list__empty}>등록된 활동 이력이 없어요.</p>
        </div>
      ) : (
        <ul className={styles.list__box}>
          {visibleActivities.map((activity) => (
            <li key={activity.id} className={styles.card}>
              <span className={styles.card__title}>{activity.title}</span>

              <dl className={styles.card__meta}>
                <dt>활동 기간</dt>
                <dd>{formatPeriod(activity)}</dd>
                <dt>활동 내용</dt>
                <dd>{activity.description}</dd>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
