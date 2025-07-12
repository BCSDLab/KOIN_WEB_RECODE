import { useClubEventDetail } from 'pages/Club/ClubDetailPage/hooks/useClubEvent';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import styles from './ClubEventDetailView.module.scss';

interface ClubEventDetailViewProps {
  clubId: number | string | undefined;
  eventId: number | string;
}

export default function ClubEventDetailView({
  clubId,
  eventId,
}: ClubEventDetailViewProps) {
  const { clubEventDetail } = useClubEventDetail(clubId, eventId);
  const isMobile = useMediaQuery();
  return (
    <div className={styles['event-detail']}>
      {isMobile && (
      <div className={styles.mobile__header}>
        <h1 className={styles['event-detail__title']}>{clubEventDetail.name}</h1>
        <div className={styles['edit-button__container']}>
          <button
            type="button"
            className={styles['edit-button--delete']}
            onClick={() => {}} // 삭제 로직 추가
          >
            행사 삭제
          </button>
          <button
            type="button"
            className={styles['edit-button--edit']}
            onClick={() => {}} // 수정 로직 추가
          >
            행사 수정
          </button>
        </div>
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
      <div className={styles['event-detail__image__container']}>
        {clubEventDetail.image_urls.length > 0 && (
        <img src={clubEventDetail.image_urls[0]} alt={clubEventDetail.name} />
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
