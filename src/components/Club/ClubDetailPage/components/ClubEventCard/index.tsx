import { cn } from '@bcsdlab/utils';
import { ClubEvent } from 'api/club/entity';
import SmallBellIcon from 'assets/svg/Club/small_bell-icon.svg';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useTokenState from 'utils/hooks/state/useTokenState';
import LoginRequiredModal from 'components/modal/LoginRequiredModal';
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
  const logger = useLogger();
  const token = useTokenState();
  const isMobile = useMediaQuery();

  const [isRecruitNotifyModalOpen, openRecruitNotifyModal, closeRecruitNotifyModal] = useBooleanState(false);
  const [isAuthModalOpen, openAuthModal, closeAuthModal] = useBooleanState(false);

  const { subscribeEventNotification, unsubscribeEventNotification } = useClubNotification(clubId);

  const isUpcomingMobile = isMobile && event.status === 'UPCOMING';
  const notifyModalType = event.is_subscribed ? 'unsubscribed' : 'subscribed';

  const handleClickEventCard = (e: React.MouseEvent<HTMLDivElement>) => {
  const target = e.target as HTMLElement;
  if (target.closest('button, a, [role="button"], input, textarea, select')) {
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
    e.stopPropagation();
    if (!token) return openAuthModal();
    openRecruitNotifyModal();
  };

  return (
    <div
      role='button'
      className={cn({
        [styles['club-event-card']]: true,
        [styles['club-event-card--ended']]: event.status === 'ENDED',
      })}
      onClick={handleClickEventCard}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleClickEventCard(e as unknown as React.MouseEvent<HTMLDivElement>);
      }}
      tabIndex={0}
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
              <button
                type='button'
                className={styles['club-event-card__status-button']}
                onClick={(e) => {
                  handleClickEventNotifyButton(e);
                }}
              >
                {getStatusLabel(event.status)}
                <SmallBellIcon />
              </button>
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
      {isAuthModalOpen && (
        <LoginRequiredModal
          title="행사 알림 기능을 사용하기"
          description="동아리 행사 알림 기능은 로그인이 필요한 서비스입니다."
          onClose={closeAuthModal}
        />
      )}
      {isRecruitNotifyModalOpen && (
        <ClubNotificationModal
          type={notifyModalType}
          variant="recruit"
          closeModal={closeRecruitNotifyModal}
          onSubmit={
            notifyModalType === 'subscribed'
              ? () => subscribeEventNotification(event.id)
              : () => unsubscribeEventNotification(event.id)
          }
        />
      )}
    </div>
  );
}
