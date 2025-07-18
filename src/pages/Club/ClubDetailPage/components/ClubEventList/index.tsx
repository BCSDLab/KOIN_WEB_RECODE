import { useClubEventList } from 'pages/Club/ClubDetailPage/hooks/useClubEvent';
import ClubEventCard from 'pages/Club/ClubDetailPage/components/ClubEventCard';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import { useState } from 'react';
import DownArrow from 'assets/svg/Club/event-filter-down-arrow.svg';
import UpArrow from 'assets/svg/Club/event-filter-up-arrow.svg';
import ClubEventDetailView from 'pages/Club/ClubDetailPage/components/ClubEventDetailView';
import useLogger from 'utils/hooks/analytics/useLogger';
import styles from './ClubEventList.module.scss';

interface ClubEventListProps {
  clubId: number | string | undefined;
  isManager: boolean;
  handleClickAddButton: () => void;
  eventId: number | string;
  setEventId: (id: number | string) => void;
  clubName: string;
}

const statusOptions = [
  { label: '최신 등록순', value: 'RECENT' },
  { label: '행사 예정', value: 'UPCOMING' },
  { label: '행사 진행 중', value: 'ONGOING' },
  { label: '종료 행사', value: 'ENDED' },
] as const;

export default function ClubEventList({
  clubId,
  isManager,
  handleClickAddButton,
  eventId,
  setEventId,
  clubName,
}: ClubEventListProps) {
  const [selectedStatus, setSelectedStatus] = useState<'RECENT' | 'UPCOMING' | 'ONGOING' | 'ENDED'>('RECENT');
  const { clubEventList } = useClubEventList(clubId, selectedStatus);
  const isMobile = useMediaQuery();
  const [isOpen, setIsOpen] = useState(false);
  const logger = useLogger();

  const getStatusLabel = (value: string) => {
    const option = statusOptions.find((opt) => opt.value === value);
    return option ? option.label : '최신 등록순';
  };

  const handleStatusSelect = (value: 'RECENT' | 'UPCOMING' | 'ONGOING' | 'ENDED') => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_event_filter',
      value: `${getStatusLabel(value)}`,
    });
    setSelectedStatus(value);
    setIsOpen(false);
  };

  return (
    <div className="club-event-list">
      {isManager && isMobile && eventId === -1 && (
        <div className={styles['create-button__container']}>
          <button
            type="button"
            className={styles['create-button']}
            onClick={handleClickAddButton}
          >
            행사 생성하기
          </button>
        </div>
      )}

      {eventId === -1 && (
      <div className={styles['filter-container']}>
        <div className={styles.dropdown__wrapper}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={styles.dropdown__button}
          >
            <span>{getStatusLabel(selectedStatus)}</span>
            {isOpen ? (
              <UpArrow />
            ) : (
              <DownArrow />
            )}
          </button>

          {isOpen && (
          <div className={styles.dropdown__menu}>
            {statusOptions.map((option) => (
              <button
                type="button"
                key={option.value}
                onClick={() => handleStatusSelect(option.value)}
                className={styles.dropdown__item}
              >
                {option.label}
              </button>
            ))}
          </div>
          )}
        </div>
      </div>
      )}
      <div className={styles['club-event-list']}>
        {eventId === -1 ? clubEventList.map((event) => (
          <ClubEventCard
            key={event.id}
            event={event}
            setEventId={setEventId}
            clubName={clubName}
          />
        ))
          : (
            <ClubEventDetailView
              clubId={clubId}
              eventId={eventId}
              setEventId={setEventId}
              isManager={isManager}
            />
          )}
      </div>
    </div>
  );
}
