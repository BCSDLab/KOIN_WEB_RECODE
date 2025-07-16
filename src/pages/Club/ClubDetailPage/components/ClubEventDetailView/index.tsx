import { useClubEventDetail } from 'pages/Club/ClubDetailPage/hooks/useClubEvent';
import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import PreImageIcon from 'assets/svg/Club/pre-image-icon.svg';
import NextImageIcon from 'assets/svg/Club/next-image-icon.svg';
import { cn } from '@bcsdlab/utils';
import styles from './ClubEventDetailView.module.scss';

interface ClubEventDetailViewProps {
  clubId: number | string | undefined;
  eventId: number | string;
  isManager: boolean;
}

export default function ClubEventDetailView({
  clubId,
  eventId,
  isManager,
}: ClubEventDetailViewProps) {
  const { clubEventDetail } = useClubEventDetail(clubId, eventId);
  const isMobile = useMediaQuery();
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
            onClick={() => {}}
          >
            행사 삭제
          </button>
          <button
            type="button"
            className={styles['edit-button--edit']}
            onClick={() => {}}
          >
            행사 수정
          </button>
        </div>
        )}
      </div>
      )}
      {isMobile && (
      <div className={styles.mobile__date}>
        {clubEventDetail.start_date.split('T')[0]}
        {' '}
        부터
        {clubEventDetail.end_date.split('T')[0]}
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
            {!isMobile && (
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
            {isMobile && (
              <div className={styles['event-detail__image__marker__container']}>
                {clubEventDetail.image_urls.map((_, index) => (
                  <div
                    className={cn({
                      [styles['event-detail__image__marker']]: true,
                      [styles['event-detail__image__marker--active']]: selectImage === index,
                    })}
                  />
                ))}
              </div>
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
        </div>
        <div className={styles['event-detail__content']}>
          행사 날짜:
          {' '}
          {clubEventDetail.start_date.split('T')[0]}
          {' '}
          부터
          {clubEventDetail.end_date.split('T')[0]}
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
      <div className={styles['event-detail__content']}>
        상세 내용:
        {' '}
        {clubEventDetail.content}
      </div>
    </div>
  );
}
