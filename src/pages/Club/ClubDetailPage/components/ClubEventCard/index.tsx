import { cn } from '@bcsdlab/utils';
import { ClubEvent } from 'api/club/entity';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import styles from './ClubEventCard.module.scss';

interface ClubEventCardProps {
  event: ClubEvent & { is_subscribed: boolean };
  setEventId: (id: number | string) => void;
  clubName: string;
}

const statusOptions = [
  { label: '곧 행사 진행', value: 'SOON' },
  { label: '행사 예정', value: 'UPCOMING' },
  { label: '행사 진행 중', value: 'ONGOING' },
  { label: '종료된 행사', value: 'ENDED' },
] as const;

const getStatusLabel = (value: string) => {
  const option = statusOptions.find((opt) => opt.value === value);
  return option?.label ?? '상태 없음';
};

function splitDateTime(dateTimeStr: string) {
  const [date, time] = dateTimeStr.split('T');

  const [yyyy, mm, dd] = date.split('-');
  const dateFormatted = `${yyyy}.${mm}.${dd}.`;

  const [hh, min] = time.split(':');
  const timeFormatted = `${hh}:${min}`;

  const fullFormatted = `${dateFormatted} ${timeFormatted}`;

  return fullFormatted;
}

export default function ClubEventCard({ event, setEventId, clubName }: ClubEventCardProps) {
  const isMobile = useMediaQuery();
  const logger = useLogger();

  const handleClickEventCard = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_event_select',
      value: clubName,
    });
    setEventId(event.id);
  };

  return (
    <div
      role="button"
      className={cn({
        [styles['club-event-card']]: true,
        [styles['club-event-card--ended']]: event.status === 'ENDED',
      })}
      onClick={handleClickEventCard}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClickEventCard()}
    >
      {event.image_urls.length > 0 && (
        <img src={event.image_urls[0]} alt={event.name} className={styles['club-event-card__image']} />
      )}
      <div className={styles['club-event-card__content']}>
        <div className={styles['club-event-card__header']}>
          <h3 className={styles['club-event-card__title']}>{event.name}</h3>
          <div className={cn({
            [styles['club-event-card__status']]: true,
            [styles['club-event-card__status--soon']]: event.status === 'SOON',
            [styles['club-event-card__status--ended']]: event.status === 'ENDED',
            [styles['club-event-card__status--upcoming']]: event.status === 'UPCOMING',
            [styles['club-event-card__status--ongoing']]: event.status === 'ONGOING',
          })}
          >
            {getStatusLabel(event.status)}
          </div>
        </div>
        <p>
          {isMobile ? (
            <>
              <div>
                {splitDateTime(event.start_date)}
                {' '}
                ~
              </div>
              <div>
                {splitDateTime(event.end_date)}
              </div>
            </>
          ) : (
            <>
              진행 날짜 :
              {' '}
              {splitDateTime(event.start_date)}
              {' '}
              ~
              {' '}
              {splitDateTime(event.end_date)}
            </>
          )}
        </p>
        <p>
          행사 소개 :
          {' '}
          {event.introduce}
        </p>
      </div>
    </div>
  );
}
