import { useEffect } from 'react';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useClubDetail from 'components/Club/ClubDetailPage/hooks/useClubdetail';
import useClubRecruitment from 'components/Club/ClubDetailPage/hooks/useClubRecruitment';
import useDeleteRecruitment from 'components/Club/ClubDetailPage/hooks/useDeleteRecruitment';
import ConfirmModal from 'components/Club/NewClubRecruitment/components/ConfirmModal';
import { useRouter } from 'next/router';
import styles from './ClubRecruitment.module.scss';

interface ClubRecruitmentProps {
  clubId: number | string | undefined;
  isManager: boolean;
  handleClickAddButton: () => void;
}
export default function ClubRecruitment({ clubId, isManager, handleClickAddButton }: ClubRecruitmentProps) {
  const logger = useLogger();
  const router = useRouter();
  const { id } = router.query as { id: string };
  const isMobile = useMediaQuery();
  const { clubDetail } = useClubDetail(Number(id));
  const { clubRecruitmentData } = useClubRecruitment(clubId);
  const { mutateAsync } = useDeleteRecruitment();
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);

  useEffect(() => {
    if (!id) {
      router.push(ROUTES.Club());
    }
  }, [id, router]);

  const handleDeleteRecruitment = async () => {
    await mutateAsync();
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_recruitment_delete_confirm',
      value: clubDetail.name,
    });
  };

  const handleClickDeleteButton = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_recruitment_delete',
      value: clubDetail.name,
    });
    openModal();
  };

  const handleClickEditButton = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_recruitment_correction',
      value: clubDetail.name,
    });
    router.push(ROUTES.ClubRecruitmentEdit({ id: String(id), isLink: true }));
  };

  const isRecruitmentExist = clubRecruitmentData.status !== 'NONE';
  const isRecruitmentClosed = clubRecruitmentData.status === 'CLOSED';
  const isNone = clubRecruitmentData.status === 'NONE';
  const isMobileManager = isMobile && isManager;
  const canCreate = isManager && isMobile && isNone;
  const RecruitmentEnd = isRecruitmentClosed || isNone;

  return (
    <div className={styles.layout}>
      {isRecruitmentExist && isMobile && (
        <div className={styles['recruitment-info__title__box']}>
          {!isRecruitmentClosed && <h2 className={styles['recruitment-info__title']}>모집기한</h2>}
          {isMobileManager && (
            <div className={styles['edit-button__container']}>
              <button type="button" className={styles['edit-button--delete']} onClick={handleClickDeleteButton}>
                모집 삭제
              </button>
              <button type="button" className={styles['edit-button--edit']} onClick={handleClickEditButton}>
                모집 수정
              </button>
            </div>
          )}
        </div>
      )}

      {canCreate && (
        <div className={styles['create-button__container']}>
          <button type="button" className={styles['create-button']} onClick={handleClickAddButton}>
            모집 생성하기
          </button>
        </div>
      )}
      {RecruitmentEnd ? (
        <div className={styles['recruitment-info--none']}>모집이 마감되었어요.</div>
      ) : (
        <>
          {!isMobile && (
            <div className={styles['recruitment-info__container']}>
              <div className={styles['recruitment-info__container--left']}>
                <div className={styles['recruitment-info__title']}>모집 기한</div>
                <div className={styles['recruitment-info__date-container']}>
                  <div className={styles['recruitment-info__dday']}>
                    {clubRecruitmentData.status === 'RECRUITING' && (
                      <span className={styles['recruitment-info__dday--recruiting']}>
                        D<span className={styles.hyphen}>-</span>
                        {clubRecruitmentData.dday}
                      </span>
                    )}
                    {clubRecruitmentData.status === 'ALWAYS' && (
                      <span className={styles['recruitment-info__dday--always']}>상시 모집</span>
                    )}
                    {clubRecruitmentData.status === 'BEFORE' && (
                      <span className={styles['recruitment-info__dday--before']}>모집 예정</span>
                    )}
                    {clubRecruitmentData.status === 'CLOSED' && (
                      <span className={styles['recruitment-info__dday--closed']}>마감</span>
                    )}
                  </div>
                  <div className={styles['recruitment-info__date']}>
                    {clubRecruitmentData.start_date !== null && (
                      <>
                        {clubRecruitmentData.start_date} 부터 {clubRecruitmentData.end_date} 까지
                      </>
                    )}
                  </div>
                </div>
                <div className={styles['recruitment-info__content']}>{clubRecruitmentData.content}</div>
              </div>
              <div className={styles['recruitment-info__image__container']}>
                {clubRecruitmentData.image_url && (
                  <img
                    className={styles['recruitment-info__image']}
                    src={clubRecruitmentData.image_url}
                    alt="모집 이미지"
                  />
                )}
              </div>
            </div>
          )}
          {isMobile && (
            <>
              <div className={styles['recruitment-info__header']}>
                <div className={styles['recruitment-info__dday']}>
                  {clubRecruitmentData.status === 'RECRUITING' && (
                    <span className={styles['recruitment-info__dday--recruiting']}>
                      D<span className={styles.hyphen}>-</span>
                      {clubRecruitmentData.dday}
                    </span>
                  )}
                  {clubRecruitmentData.status === 'ALWAYS' && (
                    <span className={styles['recruitment-info__dday--always']}>상시 모집</span>
                  )}
                  {clubRecruitmentData.status === 'BEFORE' && (
                    <span className={styles['recruitment-info__dday--before']}>모집 예정</span>
                  )}
                  {clubRecruitmentData.status === 'CLOSED' && (
                    <span className={styles['recruitment-info__dday--closed']}>마감</span>
                  )}
                </div>
                <div className={styles['recruitment-info__date']}>
                  {clubRecruitmentData.start_date !== null && (
                    <>
                      {clubRecruitmentData.start_date}
                      부터 {clubRecruitmentData.end_date}
                      까지
                    </>
                  )}
                </div>
              </div>
              <div className={styles['recruitment-info__image__container']}>
                {clubRecruitmentData.image_url && (
                  <img
                    className={styles['recruitment-info__image']}
                    src={clubRecruitmentData.image_url}
                    alt="모집 이미지"
                  />
                )}
              </div>
              <div className={styles['recruitment-info__content']}>{clubRecruitmentData.content}</div>
            </>
          )}
        </>
      )}
      {isModalOpen && (
        <ConfirmModal type="recruitmentDelete" closeModal={closeModal} onSubmit={handleDeleteRecruitment} />
      )}
    </div>
  );
}
