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

interface RecruitmentCardProps {
  recruitment: TeamRecruitment;
  eventLabel?: string;
  /** 헤더 우측에 배치할 요소. 예: 내가 지원한 모집글 목록의 지원 상태 뱃지 */
  rightSlot?: ReactNode;
  /** 정보 행 우측에 배치할 요소. 예: 내가 지원한 모집글 목록의 채팅 버튼 */
  footerAction?: ReactNode;
  /** footer 아래 별도 행에 배치할 요소. 예: 내가 작성한 모집글 목록의 지원자 관리/모집 마감 버튼 */
  actionSlot?: ReactNode;
}

export default function RecruitmentCard({
  recruitment,
  eventLabel,
  rightSlot,
  footerAction,
  actionSlot,
}: RecruitmentCardProps) {
  const logger = useLogger();

  const isClosed = recruitment.status !== 'RECRUITING';
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
        <span className={styles.card__badges}>
          <span
            className={cn({
              [styles.card__category]: true,
              [styles[CATEGORY_CLASS[recruitment.category]]]: true,
            })}
          >
            {CATEGORY_LABEL[recruitment.category]}
          </span>

          <span
            className={cn({
              [styles.card__status]: true,
              [styles['card__status--closed']]: isClosed,
            })}
          >
            {formatRecruitmentStatus(recruitment.status, recruitment.d_day)}
          </span>
        </span>

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

      {actionSlot && <div className={styles.card__actions}>{actionSlot}</div>}
    </div>
  );
}
