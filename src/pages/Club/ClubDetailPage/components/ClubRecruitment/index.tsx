import useClubRecruitment from 'pages/Club/ClubDetailPage/hooks/useClubRecruitment';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import styles from './ClubRecruitment.module.scss';

interface ClubRecruitmentProps {
  clubId: number | string | undefined;
  isManager: boolean;
  handleClickAddButton: () => void;
}
export default function ClubRecruitment({
  clubId,
  isManager,
  handleClickAddButton,
}: ClubRecruitmentProps) {
  const { clubRecruitmentData } = useClubRecruitment(clubId);
  const isMobile = useMediaQuery();

  return (
    <div className={styles.layout}>
      {!(clubRecruitmentData.status === 'CLOSED') && (
      <div className={styles['recruitment-info__title__box']}>
        <h2 className={styles['recruitment-info__title']}>
          모집기한
        </h2>
        <div className={styles['edit-button__container']}>
          <button
            type="button"
            className={styles['edit-button--delete']}
            onClick={() => {}} // 삭제 로직 추가
          >
            모집 삭제
          </button>
          <button
            type="button"
            className={styles['edit-button--edit']}
            onClick={() => {}} // 수정 로직 추가
          >
            모집 수정
          </button>
        </div>
      </div>
      )}
      {isManager && isMobile && clubRecruitmentData.status === 'CLOSED' && (
        <div className={styles['create-button__container']}>
          <button
            type="button"
            className={styles['create-button']}
            onClick={handleClickAddButton}
          >
            모집 생성하기
          </button>
        </div>
      )}
      {clubRecruitmentData.status === 'CLOSED'
        ? <div className={styles['recruitment-info--none']}>모집이 마감되었어요.</div> : (
          <>
            <div className={styles['recruitment-info__header']}>
              {!(clubRecruitmentData.status === 'NONE') && (
              <div className={styles['recruitment-info__dday']}>
                {clubRecruitmentData.status === 'RECRUITING' && (
                <span className={styles['recruitment-info__dday--recruiting']}>
                  D
                  <span className={styles.hyphen}>-</span>
                  {clubRecruitmentData.dday}
                </span>
                )}
                {clubRecruitmentData.status === 'ALWAYS' && <span className={styles['recruitment-info__dday--always']}>상시 모집</span>}
                {clubRecruitmentData.status === 'BEFORE' && <span className={styles['recruitment-info__dday--before']}>모집 예정</span>}
                {clubRecruitmentData.status === 'CLOSED' && <span className={styles['recruitment-info__dday--closed']}>마감</span>}
              </div>
              )}
              <div className={styles['recruitment-info__date']}>
                {clubRecruitmentData.start_date}
                부터
                {clubRecruitmentData.end_date}
                까지
              </div>
            </div>
            <div className={styles['recruitment-info__image__container']}>
              <img className={styles['recruitment-info__image']} src={clubRecruitmentData.image_url} alt="모집 이미지" />
            </div>
            <div className={styles['recruitment-info__content']}>
              {clubRecruitmentData.content}
            </div>
          </>
        )}
    </div>
  );
}
