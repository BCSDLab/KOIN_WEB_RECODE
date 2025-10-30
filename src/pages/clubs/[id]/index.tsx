import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { cn } from '@bcsdlab/utils';
import BellIcon from 'assets/svg/Club/bell-icon.svg';
import OffBellIcon from 'assets/svg/Club/bell-off-icon.svg';
import CopyIcon from 'assets/svg/Club/copy-icon.svg';
import LikeIcon from 'assets/svg/Club/like-icon.svg';
import NonLikeIcon from 'assets/svg/Club/unlike-icon.svg';
import UpIcon from 'assets/svg/Club/up-icon.svg';
import ClubEventList from 'components/Club/ClubDetailPage/components/ClubEventList';
import ClubIntroduction from 'components/Club/ClubDetailPage/components/ClubIntrodution';
import ClubNotificationModal from 'components/Club/ClubDetailPage/components/ClubNotificationModal';
import ClubQnA from 'components/Club/ClubDetailPage/components/ClubQnA';
import ClubRecruitment from 'components/Club/ClubDetailPage/components/ClubRecruitment';
import CreateQnAModal from 'components/Club/ClubDetailPage/components/CreateQnAModal';
import MandateClubManagerModal from 'components/Club/ClubDetailPage/components/MandateClubManagerModal';
import useClubDetail from 'components/Club/ClubDetailPage/hooks/useClubdetail';
import useClubLikeMutation from 'components/Club/ClubDetailPage/hooks/useClubLike';
import useClubRecruitmentNotification from 'components/Club/ClubDetailPage/hooks/useClubNotification';
import useClubRecruitment from 'components/Club/ClubDetailPage/hooks/useClubRecruitment';
import useDeleteEvent from 'components/Club/ClubDetailPage/hooks/useDeleteEvent';
import useDeleteRecruitment from 'components/Club/ClubDetailPage/hooks/useDeleteRecruitment';
import EditConfirmModal from 'components/Club/ClubEditPage/conponents/EditConfirmModal';
import ConfirmModal from 'components/Club/NewClubRecruitment/components/ConfirmModal';
import LoginRequiredModal from 'components/modal/LoginRequiredModal';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import { useDebounce } from 'utils/hooks/debounce/useDebounce';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useTokenState from 'utils/hooks/state/useTokenState';
import { formatPhoneNumber } from 'utils/ts/formatPhoneNumber';
import showToast from 'utils/ts/showToast';
import { useHeaderTitle } from 'utils/zustand/customTitle';
import styles from './ClubDetailPage.module.scss';

const NO_SELECTED_EVENT_ID = -1;

const TAB_LABEL = {
  intro: '상세 소개',
  recruit: '모집',
  event: '행사',
  qna: 'Q&A',
} as const;
type TabType = keyof typeof TAB_LABEL;

const TAB: Record<string, TabType> = {
  '상세 소개': 'intro',
  모집: 'recruit',
  행사: 'event',
  'Q&A': 'qna',
};

function ClubDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const { clubDetail, clubIntroductionEditStatus } = useClubDetail(Number(id));
  const { clubRecruitmentData } = useClubRecruitment(id);
  const { mutateAsync: deleteRecruitment } = useDeleteRecruitment();
  const { mutateAsync: deleteEvent } = useDeleteEvent();
  const isMobile = useMediaQuery();
  const navigate = (path: string) => router.push(path);
  const logger = useLogger();

  const [navType, setNavType] = useState('상세 소개');
  const [eventId, setEventId] = useState<string | number>(NO_SELECTED_EVENT_ID);
  const [isEdit, setIsEdit] = useState(false);
  const [introduction, setIntroduction] = useState(clubDetail.introduction);
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);
  const [isMandateModalOpen, openMandateModal, closeMandateModal] = useBooleanState(false);
  const [isAuthModalOpen, openAuthModal, closeAuthModal] = useBooleanState(false);
  const [isEditModalOpen, openEditModal, closeEditModal] = useBooleanState(false);
  const [isRecruitNotifyModalOpen, openRecruitNotifyModal, closeRecruitNotifyModal] = useBooleanState(false);
  const [isRecruitDeleteModalOpen, openRecruitDeleteModal, closeRecruitDeleteModal] = useBooleanState(false);
  const [isEventDeleteModalOpen, openEventDeleteModal, closeEventDeleteModal] = useBooleanState(false);

  const [QnAType, setQnAType] = useState('');
  const [introType, setintroType] = useState('');
  const [replyId, setReplyId] = useState(-1);

  const { setCustomTitle, resetCustomTitle } = useHeaderTitle();

  const token = useTokenState();

  const { clubLikeStatus, clubUnlikeStatus, clubLikeMutateAsync, clubUnlikeMutateAsync } = useClubLikeMutation(id);
  const { subscribeRecruitmentNotification, unsubscribeRecruitmentNotification } = useClubRecruitmentNotification(
    Number(id),
  );

  const isPending = clubLikeStatus === 'pending' || clubUnlikeStatus === 'pending';
  const notifyModalType = clubDetail.is_recruit_subscribed ? 'unsubscribed' : 'subscribed';

  const syncUrlQuery = (nextLabel: string, extra?: Record<string, string | number | undefined>) => {
    const tabKey = TAB[nextLabel] ?? 'intro';
    const nextQuery = { ...router.query, tab: tabKey, ...extra };

    if (tabKey !== 'event') delete (nextQuery as any).eventId;

    router.replace({ pathname: router.pathname, query: nextQuery }, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  const handleToggleLike = async () => {
    if (!id || isPending) return;
    if (!token) {
      openAuthModal();
      return;
    }
    if (clubDetail.is_liked) {
      await clubUnlikeMutateAsync();
      logger.actionEventClick({
        team: 'CAMPUS',
        event_label: 'club_introduction_like_cancel',
        value: clubDetail.name,
      });
    } else {
      await clubLikeMutateAsync();
      logger.actionEventClick({
        team: 'CAMPUS',
        event_label: 'club_introduction_like',
        value: clubDetail.name,
      });
    }
  };
  const debouncedToggleLike = useDebounce(handleToggleLike, 300);

  const handleIntroductionSave = async () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_introduction_correction_save',
      value: '저장',
    });
    setintroType('confirm');
    openEditModal();
  };

  const handleIntroductionCancel = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_introduction_correction_cancel',
      value: '취소',
    });
    setintroType('cancel');
    openEditModal();
  };

  const handleEditClick = async () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_correction',
      value: '수정하기',
    });
    navigate(ROUTES.ClubEdit({ id: String(id), isLink: true }));
  };
  const handleMandateClick = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_delegation_authority',
      value: '권한위임',
    });
    openMandateModal();
  };

  const handleNavClick = (navValue: string) => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_tab_select',
      value: `${navValue}`,
    });
    setNavType(navValue);
    syncUrlQuery(navValue);
  };

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('success', `${label}가 복사되었습니다.`);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
      showToast('success', `${label}가 복사되었습니다.`);
    }
  };

  const handleClickDetailInfo = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_tab_select',
      value: '상세소개 수정하기',
    });
    setIsEdit(true);
  };

  const handleClickRecruitAddButton = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_new_recruitment',
      value: clubDetail.name,
    });
    navigate(ROUTES.NewClubRecruitment({ id: String(id), isLink: true }));
  };

  const handleClickEventAddButton = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_new_event',
      value: clubDetail.name,
    });
    navigate(ROUTES.NewClubEvent({ id: String(id), isLink: true }));
  };

  const handleDeleteRecruitment = async () => {
    await deleteRecruitment();
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_recruitment_delete_confirm',
      value: clubDetail.name,
    });
  };

  const handleClickRecruitDeleteButton = () => {
    openRecruitDeleteModal();
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_recruitment_delete',
      value: clubDetail.name,
    });
  };

  const handleClickRecruitEditButton = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_recruitment_correction',
      value: clubDetail.name,
    });
    navigate(ROUTES.ClubRecruitmentEdit({ id: String(id), isLink: true }));
  };

  const handleDeleteEvent = async () => {
    await deleteEvent(Number(eventId));
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_event_delete_confirm',
      value: clubDetail.name,
    });
    setEventId(-1);
  };

  const handleClickEventDeleteButton = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_event_delete',
      value: clubDetail.name,
    });
    openEventDeleteModal();
  };

  const handleClickEventEditButton = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_event_correction',
      value: clubDetail.name,
    });
    navigate(ROUTES.ClubEventEdit({ id: String(id), eventId: String(eventId), isLink: true }));
  };

  const handleClickRecruitNotifyButton = () => {
    if (!token) return openAuthModal();
    openRecruitNotifyModal();
  };

  useEffect(() => {
    if (!router.isReady) return;
    const { tab, eventId: queryEventId } = router.query as { tab?: string; eventId?: string };

    let tabKey = (tab as TabType) ?? 'intro';
    if (!tab && queryEventId) {
      tabKey = 'event';
      router.replace({ pathname: router.pathname, query: { ...router.query, tab: 'event' } }, undefined, {
        shallow: true,
        scroll: false,
      });
    }

    const nextLabel = TAB_LABEL[tabKey] ?? '상세 소개';
    setNavType(nextLabel);

    if (tabKey === 'event') {
      if (queryEventId) setEventId(Number(queryEventId));
      else setEventId(NO_SELECTED_EVENT_ID);
    }
  }, [router]);

  useEffect(() => {
    if (clubDetail?.name) setCustomTitle(clubDetail.name);
  }, [clubDetail?.name, setCustomTitle]);
  useEffect(() => resetCustomTitle, [resetCustomTitle]);

  return (
    <div className={styles.layout}>
      {!isMobile && (
        <div className={styles['club-detail__pc-header']}>
          {navType}
          {isEdit ? (
            <div className={styles['club-detail__pc-header__button-box']}>
              <button
                type="button"
                className={styles['club-detail__pc-header__button']}
                onClick={handleIntroductionCancel}
              >
                취소
              </button>
              <button
                type="button"
                className={styles['club-detail__pc-header__button']}
                onClick={handleIntroductionSave}
                disabled={clubIntroductionEditStatus === 'pending'}
              >
                저장
              </button>
            </div>
          ) : (
            <div className={styles['club-detail__pc-header__button-box']}>
              {clubDetail.manager && (
                <>
                  {navType === '모집' &&
                    (clubRecruitmentData.status === 'NONE' ? (
                      <button
                        type="button"
                        className={styles['club-detail__pc-header__button']}
                        onClick={handleClickRecruitAddButton}
                      >
                        모집 생성하기
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          className={cn({
                            [styles['club-detail__pc-header__button']]: true,
                            [styles['club-detail__pc-header__button--delete']]: true,
                          })}
                          onClick={handleClickRecruitDeleteButton}
                        >
                          모집 공고 삭제하기
                        </button>
                        <button
                          type="button"
                          className={styles['club-detail__pc-header__button']}
                          onClick={handleClickRecruitEditButton}
                        >
                          모집 공고 수정하기
                        </button>
                      </>
                    ))}
                  {navType === '행사' &&
                    (eventId === NO_SELECTED_EVENT_ID ? (
                      <button
                        type="button"
                        className={styles['club-detail__pc-header__button']}
                        onClick={handleClickEventAddButton}
                      >
                        행사 생성하기
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          className={cn({
                            [styles['club-detail__pc-header__button']]: true,
                            [styles['club-detail__pc-header__button--delete']]: true,
                          })}
                          onClick={handleClickEventDeleteButton}
                        >
                          행사 삭제하기
                        </button>
                        <button
                          type="button"
                          className={styles['club-detail__pc-header__button']}
                          onClick={handleClickEventEditButton}
                        >
                          행사 수정하기
                        </button>
                      </>
                    ))}
                  {navType === '상세 소개' && (
                    <button
                      type="button"
                      className={styles['club-detail__pc-header__button']}
                      onClick={handleClickDetailInfo}
                    >
                      상세 소개 수정하기
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
      <div className={styles['club-detail__summary']}>
        <div className={styles['club-detail__summary__text-container']}>
          {isMobile && (
            <div className={styles['club-detail__summary__image-box']}>
              {clubDetail.image_url ? (
                <Image
                  className={styles['club-detail__summary__image']}
                  src={clubDetail.image_url}
                  alt={`${clubDetail.name} 동아리 이미지`}
                  width={300}
                  height={300}
                />
              ) : (
                <div className={styles['club-detail__image-placeholder']}>
                  <p>동아리 이미지가 없습니다.</p>
                </div>
              )}
            </div>
          )}
          {isMobile && clubDetail.manager && (
            <div className={styles['club-detail__edit-button__container']}>
              <button type="button" className={styles['club-detail__edit-button']} onClick={handleMandateClick}>
                권한 위임
              </button>
              <button type="button" className={styles['club-detail__edit-button']} onClick={handleEditClick}>
                수정하기
              </button>
            </div>
          )}
          <div
            className={cn({
              [styles['club-detail__summary__row']]: true,
              [styles['club-detail__summary__row--mobile']]: isMobile,
              [styles['club-detail__summary__row--manager']]: isMobile && clubDetail.manager,
            })}
          >
            <h1 className={styles['club-detail__summary__title']}>{clubDetail.name}</h1>
            <div className={styles['club-detail__summary__like-container']}>
              {clubDetail.hot_status && (
                <div className={styles['club-detail__summary__like-banner']}>
                  {clubDetail.hot_status.streak_count >= 2 ? (
                    `🎉 ${clubDetail.hot_status.streak_count}주 연속 인기 동아리 🎉`
                  ) : (
                    <>
                      🎉
                      {clubDetail.hot_status.month}월 {clubDetail.hot_status.week_of_month}
                      째주 인기 동아리 🎉
                    </>
                  )}
                </div>
              )}
              {isMobile && (
                <button type="button" className={styles['club-detail__summary__like']} onClick={debouncedToggleLike}>
                  {clubDetail.is_liked ? <LikeIcon /> : <NonLikeIcon />}
                  {!clubDetail.is_like_hidden && clubDetail.likes}
                </button>
              )}
            </div>
          </div>
          <div className={styles['club-detail__summary__row']}>
            분과:
            <div>{clubDetail.category} 분과</div>
          </div>
          <div className={styles['club-detail__summary__row']}>동아리 방 위치: {clubDetail.location}</div>
          <div className={styles['club-detail__summary__row']}>동아리 소개: {clubDetail.description}</div>
          <div className={styles['club-detail__summary__contacts']}>
            {clubDetail.instagram && (
              <div className={styles['club-detail__summary__contacts__row']}>
                인스타:
                <a
                  href={`https://www.instagram.com/${clubDetail.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles['club-detail__summary__contacts__row__link']}
                >
                  @{clubDetail.instagram}
                </a>
                <button
                  className={styles['copy-button']}
                  type="button"
                  aria-label="복사붙여넣기 버튼"
                  onClick={() => handleCopy(`https://www.instagram.com/${clubDetail.instagram}`, '인스타그램')}
                >
                  <CopyIcon />
                </button>
              </div>
            )}
            {clubDetail.google_form && (
              <div className={styles['club-detail__summary__contacts__row']}>
                <div className={styles['club-detail__summary__contacts__row--label']}>구글폼:</div>
                <a
                  href={clubDetail.google_form}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles['club-detail__summary__contacts__row__link']}
                >
                  <div className={styles['club-detail__summary__contacts__row__text']}>
                    https://docs.google.com/forms/...
                  </div>
                </a>
                <button
                  className={styles['copy-button']}
                  type="button"
                  aria-label="복사붙여넣기 버튼"
                  onClick={() => handleCopy(clubDetail.google_form!, '구글폼')}
                >
                  <CopyIcon />
                </button>
              </div>
            )}
            {clubDetail.open_chat && (
              <div className={styles['club-detail__summary__contacts__row']}>
                <div className={styles['club-detail__summary__contacts__row--label']}>오픈채팅:</div>
                <a
                  href={clubDetail.open_chat}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles['club-detail__summary__contacts__row__link']}
                >
                  https://open.kakao.com/o/...
                </a>
                <button
                  className={styles['copy-button']}
                  type="button"
                  aria-label="복사붙여넣기 버튼"
                  onClick={() => handleCopy(clubDetail.open_chat!, '오픈채팅')}
                >
                  <CopyIcon />
                </button>
              </div>
            )}
            {clubDetail.phone_number && (
              <div className={styles['club-detail__summary__contacts__row']}>
                <div className={styles['club-detail__summary__contacts__row--label']}>전화번호:</div>
                <div className={styles['club-detail__summary__contacts__text']}>
                  {clubDetail.phone_number && formatPhoneNumber(clubDetail.phone_number)}
                </div>
                <button
                  className={styles['copy-button']}
                  type="button"
                  aria-label="복사붙여넣기 버튼"
                  onClick={() => handleCopy(clubDetail.phone_number!, '전화번호')}
                >
                  <CopyIcon />
                </button>
              </div>
            )}
            {isMobile && (
              <div>
                <div className={styles['club-detail__summary__contacts__row']}>
                  <div className={styles['club-detail__summary__contacts__row--label']}>모집알림:</div>
                  <button type="button" aria-label="모집 알림 구독 버튼" onClick={handleClickRecruitNotifyButton}>
                    {clubDetail.is_recruit_subscribed ? <BellIcon /> : <OffBellIcon />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {!isMobile && (
          <div className={styles['club-detail__summary__image-container']}>
            {!isMobile && clubDetail.manager && (
              <div className={styles['club-detail__edit-button__container']}>
                <button type="button" className={styles['club-detail__edit-button']} onClick={handleMandateClick}>
                  권한 위임
                </button>
                <button type="button" className={styles['club-detail__edit-button']} onClick={handleEditClick}>
                  수정하기
                </button>
              </div>
            )}
            <div className={styles['club-detail__summary__image-box']}>
              {clubDetail.image_url ? (
                <Image
                  className={styles['club-detail__summary__image']}
                  src={clubDetail.image_url}
                  alt={`${clubDetail.name} 동아리 이미지`}
                  width={200}
                  height={200}
                />
              ) : (
                <div className={styles['club-detail__image-placeholder']}>
                  <p>동아리 이미지가 없습니다.</p>
                </div>
              )}
            </div>
            <button
              type="button"
              className={styles['club-detail__like']}
              disabled={isPending}
              onClick={debouncedToggleLike}
            >
              {clubDetail.is_liked ? <LikeIcon /> : <NonLikeIcon />}
              <div className={styles['club-detail__like__text']}>
                {!clubDetail.is_like_hidden && `좋아요 ${clubDetail.likes || 0} 개`}
              </div>
            </button>
          </div>
        )}
      </div>
      <div className={styles.nav}>
        <button
          type="button"
          className={cn({
            [styles['nav-type']]: true,
            [styles['nav-type--active']]: navType === '상세 소개',
          })}
          onClick={() => handleNavClick('상세 소개')}
        >
          상세소개
        </button>
        <button
          type="button"
          className={cn({
            [styles['nav-type']]: true,
            [styles['nav-type--active']]: navType === '모집',
          })}
          onClick={() => handleNavClick('모집')}
        >
          모집
        </button>
        <button
          type="button"
          className={cn({
            [styles['nav-type']]: true,
            [styles['nav-type--active']]: navType === '행사',
          })}
          onClick={() => {
            handleNavClick('행사');
            setEventId(NO_SELECTED_EVENT_ID);
            syncUrlQuery('행사');
          }}
        >
          행사
        </button>
        <button
          type="button"
          className={cn({
            [styles['nav-type']]: true,
            [styles['nav-type--active']]: navType === 'Q&A',
          })}
          onClick={() => handleNavClick('Q&A')}
        >
          Q&A
        </button>
      </div>
      {isMobile && (
        <div className={styles['club-detail__mobile-button__container']}>
          {isEdit && navType === '상세 소개' ? (
            <div className={styles['club-detail__mobile-button__box']}>
              <button
                type="button"
                className={styles['club-detail__mobile-button__button']}
                onClick={handleIntroductionCancel}
              >
                취소
              </button>
              <button
                type="button"
                className={styles['club-detail__mobile-button__button']}
                onClick={handleIntroductionSave}
                disabled={clubIntroductionEditStatus === 'pending'}
              >
                저장
              </button>
            </div>
          ) : (
            <div className={styles['club-detail__mobile-button__button-box']}>
              {clubDetail.manager && navType === '상세 소개' && (
                <button
                  type="button"
                  className={styles['club-detail__mobile-button__button']}
                  onClick={handleClickDetailInfo}
                >
                  상세 소개 수정
                  {!isMobile && '하기'}
                </button>
              )}
            </div>
          )}
        </div>
      )}
      {navType === '상세 소개' && (
        <ClubIntroduction isEdit={isEdit} introduction={introduction} setIntroduction={setIntroduction} />
      )}
      {navType === 'Q&A' && (
        <ClubQnA
          openModal={openModal}
          clubId={id}
          isManager={clubDetail.manager}
          openAuthModal={openAuthModal}
          setQnA={setQnAType}
          setReplyId={setReplyId}
        />
      )}
      {navType === '모집' && (
        <ClubRecruitment
          clubId={id}
          isManager={clubDetail.manager}
          handleClickAddButton={handleClickRecruitAddButton}
        />
      )}
      {navType === '행사' && (
        <ClubEventList
          clubId={id}
          isManager={clubDetail.manager}
          handleClickAddButton={handleClickEventAddButton}
          eventId={eventId}
          setEventId={setEventId}
          clubName={clubDetail.name}
        />
      )}
      {isModalOpen && <CreateQnAModal closeModal={closeModal} clubId={id} type={QnAType} replyId={replyId} />}
      {isMandateModalOpen && (
        <MandateClubManagerModal closeModal={closeMandateModal} clubId={id} clubName={clubDetail.name} />
      )}
      {isAuthModalOpen && (
        <LoginRequiredModal
          title="좋아요 기능을 사용하기"
          description="동아리 좋아요 기능은 로그인이 필요한 서비스입니다."
          onClose={closeAuthModal}
        />
      )}
      {isEditModalOpen && (
        <EditConfirmModal
          closeModal={closeEditModal}
          type={introType}
          introduction={introduction}
          setIsEdit={setIsEdit}
          resetForm={() => setIntroduction(clubDetail.introduction)}
          id={id}
        />
      )}
      {isRecruitDeleteModalOpen && (
        <ConfirmModal
          type="recruitmentDelete"
          closeModal={closeRecruitDeleteModal}
          onSubmit={handleDeleteRecruitment}
        />
      )}
      {isEventDeleteModalOpen && (
        <ConfirmModal type="eventDelete" closeModal={closeEventDeleteModal} onSubmit={handleDeleteEvent} />
      )}
      {isRecruitNotifyModalOpen && (
        <ClubNotificationModal
          type={notifyModalType}
          variant="recruit"
          closeModal={closeRecruitNotifyModal}
          onSubmit={
            notifyModalType === 'subscribed' ? subscribeRecruitmentNotification : unsubscribeRecruitmentNotification
          }
        />
      )}
      {navType === 'Q&A' && (
        <div className={styles['up-floating-button__container']}>
          <button
            type="button"
            className={styles['up-floating-button']}
            aria-label="스크롤 위로 버튼"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <UpIcon />
          </button>
        </div>
      )}
    </div>
  );
}

export default function ClubDetail() {
  const router = useRouter();
  const { id } = router.query as { id: string };

  if (!id) {
    return null;
  }

  return <ClubDetailPage id={id} />;
}
