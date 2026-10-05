import XIcon from 'assets/svg/Team/x-icon.svg';
import { formatRecruitmentDate } from 'components/Team/utils/recruitmentDisplay';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import type { TeamApplicationActivity } from 'api/team/entity';
import styles from './ActivityHistoryDetailModal.module.scss';

interface ActivityHistoryDetailModalProps {
  activities: TeamApplicationActivity[];
  onClose: () => void;
}

const formatPeriod = (activity: TeamApplicationActivity) => {
  const endLabel = activity.is_ongoing ? '진행 중' : formatRecruitmentDate(activity.ended_at ?? '');
  return `${formatRecruitmentDate(activity.started_at)} - ${endLabel}`;
};

export default function ActivityHistoryDetailModal({ activities, onClose }: ActivityHistoryDetailModalProps) {
  const { containerRef, backgroundRef } = useOutsideClick({ onOutsideClick: onClose });
  useEscapeKeyDown({ onEscape: onClose });

  return (
    <div className={styles.background} ref={backgroundRef}>
      <div
        className={styles.modal}
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="activity-history-detail-title"
      >
        <div className={styles.modal__header}>
          <h2 id="activity-history-detail-title" className={styles.modal__title}>
            활동 이력
          </h2>
          <button type="button" className={styles.modal__close} onClick={onClose} aria-label="닫기">
            <XIcon aria-hidden />
          </button>
        </div>

        <ul className={styles.modal__list}>
          {activities.map((activity) => (
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
      </div>
    </div>
  );
}
