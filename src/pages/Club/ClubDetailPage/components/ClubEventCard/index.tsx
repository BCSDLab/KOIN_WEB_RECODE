import { cn } from '@bcsdlab/utils';
import { ClubEvent } from 'api/club/entity';
import useLogger from 'utils/hooks/analytics/useLogger';
// import AlarmIcon from 'assets/svg/Club/alarm.svg';
import styles from './ClubEventCard.module.scss';

interface ClubEventCardProps {
  event: ClubEvent & { is_subscribed: boolean };
  setEventId: (id: number | string) => void;
  clubName: string;
}

export default function ClubEventCard({ event, setEventId, clubName }: ClubEventCardProps) {
  const logger = useLogger();

  const handleClickEventCard = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_event_select',
      value: `${clubName}`,
    });
    setEventId(event.id);
  };

  return (
    <div
      role="button"
      className={styles['club-event-card']}
      onClick={handleClickEventCard}
      tabIndex={0}
      onKeyDown={() => {}}
    >
      {event.image_urls.length > 0 && (
        <img src={event.image_urls[0]} alt={event.name} className={styles['club-event-card__image']} />
      )}
      <div className={styles['club-event-card__content']}>
        <div className={styles['club-event-card__header']}>
          <h3 className={styles['club-event-card__title']}>{event.name}</h3>
          <div className={cn({
            [styles['club-event-card__status']]: true,
            [styles['club-event-card__status--upcoming']]: event.status === '곧 행사 진행',
            [styles['club-event-card__status--ended']]: event.status === '종료된 행사',
            [styles['club-event-card__status--upcomingSoon']]: event.status === '최신 등록순',
            [styles['club-event-card__status--ongoing']]: event.status === '행사 진행 중',
          })}
          >
            {event.status}
            {/* <AlarmIcon />
          {event.is_subscribed ? '알림 설정됨' : '알림 설정 안 됨'} */}
          </div>
        </div>
        <p>
          진행 날짜 :
          {' '}
          {event.start_date.split('T')[0]}
          {' '}
          ~
          {' '}
          {event.end_date.split('T')[0]}
        </p>
        <p>
          행사 소개 :
          {event.introduce}
        </p>
      </div>
    </div>
  );
}
