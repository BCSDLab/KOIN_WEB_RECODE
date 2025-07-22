import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@bcsdlab/utils';
import { useSwipeable } from 'react-swipeable';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useClubEventDetail } from 'pages/Club/ClubDetailPage/hooks/useClubEvent';
import useDeleteEvent from 'pages/Club/ClubDetailPage/hooks/useDeleteEvent';
import ROUTES from 'static/routes';
import NextImageIcon from 'assets/svg/Club/next-image-icon.svg';
import PreImageIcon from 'assets/svg/Club/pre-image-icon.svg';
import ConfirmModal from 'pages/Club/NewClubRecruitment/components/ConfirmModal';
import styles from './ClubEventDetailView.module.scss';

interface ClubEventDetailViewProps {
  clubId: number | string | undefined;
  eventId: number | string;
  setEventId: (eventID: number) => void;
  isManager: boolean;
}

const formatDateTimeByDevice = (dateTimeStr: string, isMobile: boolean) => {
  const date = new Date(dateTimeStr);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');

  if (isMobile) {
    return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
  }
  return `${yyyy}년 ${mm}월 ${dd}일 ${hh}시 ${min}분`;
};

const statusOptions = [
  { label: '곧 행사 진행', value: 'SOON' },
  { label: '행사 예정', value: 'UPCOMING' },
  { label: '행사 진행 중', value: 'ONGOING' },
  { label: '종료된 행사', value: 'ENDED' },
] as const;

export default function ClubEventDetailView({
  clubId,
  eventId,
  setEventId,
  isManager,
}: ClubEventDetailViewProps) {
  const navigate = useNavigate();
  const isMobile = useMediaQuery();
  const { clubEventDetail } = useClubEventDetail(clubId, eventId);
  const { mutateAsync } = useDeleteEvent();

  const [isModalOpen, openModal, closeModal] = useBooleanState(false);

  const getStatusLabel = (value: string) => {
    const option = statusOptions.find((opt) => opt.value === value);
    return option ? option.label : '최신 등록순';
  };

  const handleEventDelete = async () => {
    await mutateAsync(Number(eventId));
    setEventId(-1);
    closeModal();
  };

  const handleClickDeleteButton = async () => {
    openModal();
  };

  const handleClickEditButton = () => {
    navigate(
      ROUTES.ClubEventEdit({
        id: String(clubId),
        eventId: String(eventId),
        isLink: true,
      }),
    );
  };

  const [selectImage, setSelectImage] = useState(0);

  const handlePrevButtonClick = () => {
    setSelectImage((prev) => (prev === 0 ? clubEventDetail.image_urls.length - 1 : prev - 1));
  };

  const handleNextButtonClick = () => {
    setSelectImage((prev) => (prev === clubEventDetail.image_urls.length - 1 ? 0 : prev + 1));
  };
  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNextButtonClick,
    onSwipedRight: handlePrevButtonClick,
    trackMouse: true,
  });

  return (
    <div className={styles['event-detail']}>
      {isMobile && (
      <div className={styles.mobile__header}>
        <h1 className={styles['event-detail__title']}>{clubEventDetail.name}</h1>
        {isManager && (
        <div className={styles['edit-button__container']}>
          <button
            type="button"
            className={styles['edit-button--delete']}
            onClick={handleClickDeleteButton}
          >
            행사 삭제
          </button>
          <button
            type="button"
            className={styles['edit-button--edit']}
            onClick={handleClickEditButton}
          >
            행사 수정
          </button>
        </div>
        )}
      </div>
      )}
      {isMobile && (
      <div className={styles.mobile__date}>
        {formatDateTimeByDevice(clubEventDetail.start_date, isMobile)}
        {' '}
        부터
        {' '}
        {formatDateTimeByDevice(clubEventDetail.end_date, isMobile)}
        {' '}
        까지
      </div>
      )}
      <div
        {...(isMobile ? swipeHandlers : {})}
        className={styles['event-detail__image__container']}
      >
        {clubEventDetail.image_urls.length > 0 && (
          <>
            {!isMobile && <div className={styles['event-detail__image__counter']}>{`${selectImage + 1} / ${clubEventDetail.image_urls.length}`}</div>}
            <img
              className={styles['event-detail__image']}
              src={clubEventDetail.image_urls[selectImage]}
              alt={clubEventDetail.name}
            />
            {isMobile ? (
              <div className={styles['event-detail__image__marker__container']}>
                {clubEventDetail.image_urls.map((_, index) => (
                  <div
                    key={clubEventDetail.image_urls[index]}
                    className={cn({
                      [styles['event-detail__image__marker']]: true,
                      [styles['event-detail__image__marker--active']]: selectImage === index,
                    })}
                  />
                ))}
              </div>
            ) : (
              <>
                <button
                  type="button"
                  className={styles['event-detail__image__pre-button']}
                  aria-label="이전 이미지"
                  onClick={handlePrevButtonClick}
                >
                  <PreImageIcon />
                </button>
                <button
                  type="button"
                  className={styles['event-detail__image__next-button']}
                  aria-label="다음 이미지"
                  onClick={handleNextButtonClick}
                >
                  <NextImageIcon />
                </button>
              </>
            )}
          </>
        )}
      </div>
      {!isMobile
      && (
      <>
        <div className={styles['event-detail__content']}>
          행사 이름:
          {' '}
          {clubEventDetail.name}
          <div className={cn({
            [styles['event-detail__status']]: true,
            [styles['event-detail__status--soon']]: clubEventDetail.status === 'SOON',
            [styles['event-detail__status--ended']]: clubEventDetail.status === 'ENDED',
            [styles['event-detail__status--upcoming']]: clubEventDetail.status === 'UPCOMING',
            [styles['event-detail__status--ongoing']]: clubEventDetail.status === 'ONGOING',
          })}
          >
            {getStatusLabel(clubEventDetail.status)}
          </div>
        </div>
        <div className={styles['event-detail__content']}>
          행사 날짜:
          {' '}
          {formatDateTimeByDevice(clubEventDetail.start_date, isMobile)}
          {' '}
          부터
          {' '}
          {formatDateTimeByDevice(clubEventDetail.end_date, isMobile)}
          {' '}
          까지
        </div>
      </>
      )}
      <div className={styles['event-detail__content']}>
        행사 내용:
        {' '}
        {clubEventDetail.introduce}
      </div>
      {!isMobile && <hr className={styles['event-detail__divider']} />}
      <div className={styles['event-detail__content']}>
        상세 내용:
        {' '}
        {clubEventDetail.content}
      </div>
      {isModalOpen && (
        <ConfirmModal
          type="eventDelete"
          closeModal={closeModal}
          onSubmit={handleEventDelete}
        />
      )}
    </div>

  );
}
