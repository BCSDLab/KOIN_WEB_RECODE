import Link from 'next/link';
import { cn } from '@bcsdlab/utils';

import CalendarIcon from 'assets/svg/Team/calendar.svg';
import LocationIcon from 'assets/svg/Team/location.svg';
import PeopleIcon from 'assets/svg/Team/people.svg';
import formatRecruitmentStatus from 'components/Team/utils/formatRecruitmentStatus';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import type {
  TeamRecruitmentCard as TeamRecruitment,
  TeamRecruitmentCategory,
  TeamRecruitmentMeetingType,
} from 'api/team/entity';
import styles from './RecruitmentCard.module.scss';

interface RecruitmentCardProps {
  recruitment: TeamRecruitment;
}

const CATEGORY_LABEL: Record<TeamRecruitmentCategory, string> = {
  CONTEST: '공모전',
  EXTERNAL_ACTIVITY: '대외활동',
  STUDY: '스터디',
  PROJECT: '프로젝트',
  OTHER: '기타',
};

const CATEGORY_CLASS: Record<TeamRecruitmentCategory, string> = {
  CONTEST: 'card__category--contest',
  EXTERNAL_ACTIVITY: 'card__category--external-activity',
  STUDY: 'card__category--study',
  PROJECT: 'card__category--project',
  OTHER: 'card__category--other',
};

const MEETING_TYPE_LABEL: Record<TeamRecruitmentMeetingType, string> = {
  ONLINE: '온라인',
  OFFLINE: '오프라인',
  MIXED: '온 · 오프라인',
};

const formatDate = (date: string) => date.replaceAll('-', '.');

export default function RecruitmentCard({ recruitment }: RecruitmentCardProps) {
  const logger = useLogger();

  const isClosed = recruitment.status !== 'RECRUITING';
  const isFull = recruitment.current_participants >= recruitment.max_participants;

  const handleClick = () => {
    logger.actionEventClick({ team: 'CAMPUS', event_label: 'team_recruitment_post_select', value: recruitment.title });
  };

  return (
    <Link href={ROUTES.TeamDetail({ postId: String(recruitment.id) })} className={styles.card} onClick={handleClick}>
      <div className={styles.card__header}>
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

      <div className={styles.card__information}>
        <span className={styles['card__information-item']}>
          <LocationIcon />
          {MEETING_TYPE_LABEL[recruitment.meeting_type]}
        </span>

        <span className={styles['card__information-item']}>
          <CalendarIcon />
          {formatDate(recruitment.activity_start_date)} ~ {formatDate(recruitment.activity_end_date)}
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
    </Link>
  );
}
