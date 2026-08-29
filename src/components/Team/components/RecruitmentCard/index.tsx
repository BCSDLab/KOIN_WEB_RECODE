import type { ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@bcsdlab/utils';

import CalendarIcon from 'assets/svg/Team/calendar.svg';
import LocationIcon from 'assets/svg/Team/location.svg';
import PeopleIcon from 'assets/svg/Team/people.svg';
import formatRecruitmentStatus from 'components/Team/utils/formatRecruitmentStatus';
import {
  CATEGORY_CLASS,
  CATEGORY_LABEL,
  formatRecruitmentDate,
  MEETING_TYPE_LABEL,
} from 'components/Team/utils/recruitmentDisplay';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import type { TeamRecruitmentCard as TeamRecruitment } from 'api/team/entity';
import styles from './RecruitmentCard.module.scss';

interface RecruitmentBadgesProps {
  category: TeamRecruitment['category'];
  status: TeamRecruitment['status'];
  dDay: TeamRecruitment['d_day'];
}

export function RecruitmentBadges({ category, status, dDay }: RecruitmentBadgesProps) {
  const isClosed = status !== 'RECRUITING';

  return (
    <span className={styles.card__badges}>
      <span
        className={cn({
          [styles.card__category]: true,
          [styles[CATEGORY_CLASS[category]]]: true,
        })}
      >
        {CATEGORY_LABEL[category]}
      </span>

      <span
        className={cn({
          [styles.card__status]: true,
          [styles['card__status--closed']]: isClosed,
        })}
      >
        {formatRecruitmentStatus(status, dDay)}
      </span>
    </span>
  );
}

interface RecruitmentCardProps {
  recruitment: TeamRecruitment;
  eventLabel?: string;
  rightSlot?: ReactNode;
  footerAction?: ReactNode;
}

export default function RecruitmentCard({ recruitment, eventLabel, rightSlot, footerAction }: RecruitmentCardProps) {
  const logger = useLogger();

  const isFull = recruitment.current_participants >= recruitment.max_participants;

  const handleClick = () => {
    if (!eventLabel) return;
    logger.actionEventClick({ team: 'CAMPUS', event_label: eventLabel, value: recruitment.title });
  };

  return (
    <div className={styles.card}>
      <Link
        href={ROUTES.TeamDetail({ postId: String(recruitment.id) })}
        className={styles.card__overlayLink}
        onClick={handleClick}
        aria-label={recruitment.title}
      />

      <div className={styles.card__header}>
        <RecruitmentBadges category={recruitment.category} status={recruitment.status} dDay={recruitment.d_day} />

        {rightSlot}
      </div>

      <h2 className={styles.card__title}>{recruitment.title}</h2>

      {recruitment.roles.length > 0 && (
        <div className={styles.card__roles}>
          {recruitment.roles.map((role) => (
            <span className={styles.card__role} key={role.id}>
              {role.name} {role.max_participants}명
            </span>
          ))}
        </div>
      )}

      <div className={styles.card__footer}>
        <div className={styles.card__information}>
          <span className={styles['card__information-item']}>
            <LocationIcon />
            {MEETING_TYPE_LABEL[recruitment.meeting_type]}
          </span>

          <span className={styles['card__information-item']}>
            <CalendarIcon />
            {formatRecruitmentDate(recruitment.activity_start_date)} ~{' '}
            {formatRecruitmentDate(recruitment.activity_end_date)}
          </span>

          <span
            className={cn({
              [styles['card__information-item']]: true,
              [styles['card__information-item--full']]: isFull,
            })}
          >
            <PeopleIcon />
            {recruitment.current_participants}/{recruitment.max_participants}명
          </span>
        </div>

        {footerAction && <div className={styles.card__action}>{footerAction}</div>}
      </div>
    </div>
  );
}
