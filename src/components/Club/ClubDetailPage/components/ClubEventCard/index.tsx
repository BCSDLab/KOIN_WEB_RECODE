import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { cn } from '@bcsdlab/utils';
import { ClubEvent } from 'api/club/entity';
import SmallBellIcon from 'assets/svg/Club/small_bell-icon.svg';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import ClubNotificationModal from 'components/Club/ClubDetailPage/components/ClubNotificationModal';
import useClubNotification from 'components/Club/ClubDetailPage/hooks/useClubNotification';
import styles from './ClubEventCard.module.scss';

interface ClubEventCardProps {
  event: ClubEvent & { is_subscribed: boolean };
  setEventId: (id: number | string) => void;
  clubName: string;
  clubId: number;
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

export default function ClubEventCard({ event, setEventId, clubId, clubName }: ClubEventCardProps) {
  const router = useRouter();
  const logger = useLogger();
  const isMobile = useMediaQuery();

  const [isRecruitNotifyModalOpen, openRecruitNotifyModal, closeRecruitNotifyModal] = useBooleanState(false);

  const { subscribeEventNotification, unsubscribeEventNotification } = useClubNotification(clubId);

  const isUpcomingMobile = isMobile && event.status === 'UPCOMING';
  const notifyModalType = event.is_subscribed ? 'unsubscribed' : 'subscribed';

  const href = {
    pathname: '/clubs/[id]',
    query: {
      ...router.query,
      id: String(clubId),
      tab: 'event',
      eventId: String(event.id),
    },
  };
  const as = `/clubs/${clubId}?tab=event&eventId=${event.id}`;

  const handleLinkClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if ((e.target as HTMLElement).closest('button')) {
      e.preventDefault();
      return;
    }
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_event_select',
      value: clubName,
    });
    setEventId(event.id);
  };

  const handleClickEventNotifyButton = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openRecruitNotifyModal();
  };

  return (
    <Link
      href={href}
      as={as}
      shallow
      scroll={false}
      onClick={handleLinkClick}
      className={cn({
        [styles['club-event-card']]: true,
        [styles['club-event-card--ended']]: event.status === 'ENDED',
      })}
    >
      {event.image_urls.length > 0 && (
        <div className={styles['card-image-container']}>
          <Image
            src={event.image_urls[0]}
            alt={event.name}
            className={styles['club-event-card__image']}
            fill
            sizes="250px"
          />
        </div>
      )}

      <div className={styles['club-event-card__content']}>
        <div className={styles['club-event-card__header']}>
          <h3 className={styles['club-event-card__title']}>{event.name}</h3>

          <div
            className={cn({
              [styles['club-event-card__status']]: true,
              [styles['club-event-card__status--soon']]: event.status === 'SOON',
              [styles['club-event-card__status--ended']]: event.status === 'ENDED',
              [styles['club-event-card__status--upcoming']]: event.status === 'UPCOMING',
              [styles['club-event-card__status--ongoing']]: event.status === 'ONGOING',
            })}
          >
            {isUpcomingMobile ? (
              <button
                type="button"
                className={styles['club-event-card__status-button']}
                onClick={handleClickEventNotifyButton}
                data-no-link
              >
                {getStatusLabel(event.status)}
                <SmallBellIcon />
              </button>
            ) : (
              getStatusLabel(event.status)
            )}
          </div>
        </div>
        <div className={styles['club-event-card__body']}>
          <div>
            {isMobile ? (
              <>
                <div>{splitDateTime(event.start_date)} ~</div>
                <div>{splitDateTime(event.end_date)}</div>
              </>
            ) : (
              <>
                진행 날짜 : {splitDateTime(event.start_date)} ~ {splitDateTime(event.end_date)}
              </>
            )}
          </div>
          <div>행사 소개 : {event.introduce}</div>
        </div>
      </div>
      {isRecruitNotifyModalOpen && (
        <ClubNotificationModal
          type={notifyModalType}
          variant="event"
          closeModal={closeRecruitNotifyModal}
          onSubmit={
            notifyModalType === 'subscribed'
              ? () => subscribeEventNotification(event.id)
              : () => unsubscribeEventNotification(event.id)
          }
        />
      )}
    </Link>
  );
}
