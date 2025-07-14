import { useClubEventList } from 'pages/Club/ClubDetailPage/hooks/useClubEvent';
import ClubEventCard from 'pages/Club/ClubDetailPage/components/ClubEventCard';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import { useState } from 'react';
import DownArrow from 'assets/svg/Club/event-filter-down-arrow.svg';
import UpArrow from 'assets/svg/Club/event-filter-up-arrow.svg';
import styles from './ClubEventList.module.scss';
import ClubEventDetailView from './ClubEventDetailView';

interface ClubEventListProps {
  clubId: number | string | undefined;
  isManager: boolean;
  handleClickAddButton: () => void;
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
}: ClubEventListProps) {
  const [selectedStatus, setSelectedStatus] = useState<'RECENT' | 'UPCOMING' | 'ONGOING' | 'ENDED'>('RECENT');
  const { clubEventList } = useClubEventList(clubId!, selectedStatus);
  const isMobile = useMediaQuery();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | string | null>(null);

  const getStatusLabel = (value: string) => {
    const option = statusOptions.find((opt) => opt.value === value);
    return option ? option.label : '최신 등록순';
  };

  const handleStatusSelect = (value: 'RECENT' | 'UPCOMING' | 'ONGOING' | 'ENDED') => {
    setSelectedStatus(value);
    setIsOpen(false);
  };

  const handleEventClick = (eventId: number | string) => {
    setSelectedEventId(eventId);
  };

  const handleBackToList = () => {
    setSelectedEventId(null);
  };

  console.log('clubEventList', clubEventList);

  if (selectedEventId) {
    return (
      <ClubEventDetailView
        clubId={clubId!}
        eventId={selectedEventId}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="club-event-list">
      {isManager && isMobile && (
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
      <div className={styles['club-event-list']}>
        {clubEventList.map((event) => (
          <ClubEventCard key={event.id} event={event} onEventClick={handleEventClick} />
        ))}
      </div>
    </div>
  );
}
