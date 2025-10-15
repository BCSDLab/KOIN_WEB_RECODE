import { cn } from '@bcsdlab/utils';
import { ClubEvent } from 'api/club/entity';
import SmallBellIcon from 'assets/svg/Club/small_bell-icon.svg'
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

const splitDateTime = (dateTimeStr: string) => {
  const [date, time] = dateTimeStr.split('T');

  const [yyyy, mm, dd] = date.split('-');
  const dateFormatted = `${yyyy}.${mm}.${dd}.`;

  const [hh, min] = time.split(':');
  const timeFormatted = `${hh}:${min}`;

  const fullFormatted = `${dateFormatted} ${timeFormatted}`;

  return fullFormatted;
};

export default function ClubEventCard({ event, setEventId, clubName }: ClubEventCardProps) {
  const isMobile = useMediaQuery();
  const logger = useLogger();

  const isUpcomingMobile = isMobile && event.status === 'UPCOMING';

  const handleClickEventCard = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_event_select',
      value: clubName,
    });
    setEventId(event.id);
  };

  const handleKeyDownEventCard = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      logger.actionEventClick({
        team: 'CAMPUS',
        event_label: 'club_event_select',
        value: clubName,
      });
      setEventId(event.id);
    }
  };

  return (
    <button
      type="button"
      className={cn({
        [styles['club-event-card']]: true,
        [styles['club-event-card--ended']]: event.status === 'ENDED',
      })}
      onClick={handleClickEventCard}
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
            {isUpcomingMobile ? (
              <div
                role="button"
                className={styles['club-event-card__status-button']}
                aria-label="행사 예정 상태 버튼"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('알림 설정/해제');
                }}
              >
                {getStatusLabel(event.status)}
                <SmallBellIcon
                  className={styles['club-event-card__status-icon']}
                  aria-hidden
                  focusable="false"
                />
              </div>
            ) : (
              <>
                {getStatusLabel(event.status)}
              </>
            )}
          </div>
        </div>
        <div className={styles['club-event-card__body']}>
          <div>
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
          </div>
          <div>
            행사 소개 :
            {' '}
            {event.introduce}
          </div>
        </div>
      </div>
    </button>
  );
}
