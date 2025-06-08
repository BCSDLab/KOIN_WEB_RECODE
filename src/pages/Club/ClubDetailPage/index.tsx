import { useNavigate, useParams } from 'react-router-dom';
import LikeIcon from 'assets/svg/Club/like-icon.svg';
import NonLikeIcon from 'assets/svg/Club/unlike-icon.svg';
import CopyIcon from 'assets/svg/Club/copy-icon.svg';
import UpIcon from 'assets/svg/Club/up-icon.svg';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import { cn } from '@bcsdlab/utils';
import { useEffect, useState } from 'react';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import ROUTES from 'static/routes';
import ClubAuthModal from 'pages/Club/components/ClubAuthModal';
import useTokenState from 'utils/hooks/state/useTokenState';
import useLogger from 'utils/hooks/analytics/useLogger';
import { useHeaderTitle } from 'utils/zustand/customTitle';
import { formatPhoneNumber } from 'utils/ts/formatPhoneNumber';
import showToast from 'utils/ts/showToast';
import useClubDetail from './hooks/useClubdetail';
import styles from './ClubDetailPage.module.scss';
import useClubLikeMutation from './hooks/useClubLike';
import ClubIntroduction from './components/ClubIntrodution';
import ClubQnA from './components/ClubQnA';
import CreateQnAModal from './components/CreateQnAModal';
import MandateClubManagerModal from './components/MandateClubManagerModal';

export default function ClubDetailPage() {
  const { id } = useParams();
  const {
    clubDetail,
    clubIntroductionEditStatus,
    clubIntroductionEditMutateAsync,
  } = useClubDetail(id);
  const isMobile = useMediaQuery();
  const navigate = useNavigate();
  const logger = useLogger();

  const [navType, setNavType] = useState('상세 소개');
  const [isEdit, setIsEdit] = useState(false);
  const [introduction, setIntroduction] = useState(clubDetail.introduction);
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);
  const [isMandateModalOpen, openMandateModal, closeMandateModal] = useBooleanState(false);
  const [isAuthModalOpen, openAuthModal, closeAuthModal] = useBooleanState(false);

  const { setCustomTitle, resetCustomTitle } = useHeaderTitle();

  const token = useTokenState();

  const {
    clubLikeStatus, clubUnlikeStatus, clubLikeMutateAsync, clubUnlikeMutateAsync,
  } = useClubLikeMutation(id);
  const isPending = clubLikeStatus === 'pending' || clubUnlikeStatus === 'pending';

  useEffect(() => {
    if (clubDetail?.name) setCustomTitle(clubDetail.name);
  }, [clubDetail?.name, setCustomTitle]);
  useEffect(() => resetCustomTitle, [resetCustomTitle]);

  const handleToggleLike = async () => {
    if (!id || isPending) return;
    if (!token) {
      openAuthModal();
      return;
    }
    if (clubDetail.is_liked) {
      await clubUnlikeMutateAsync();
    } else {
      await clubLikeMutateAsync();
    }
  };

  const handleIntroductionSave = async () => {
    await clubIntroductionEditMutateAsync({ introduction });
    setIsEdit(false);
  };

  const handleIntroductionCancel = () => {
    setIntroduction(clubDetail.introduction);
    setIsEdit(false);
  };

  const handleEditClick = async () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_category: 'click',
      event_label: 'club_correction',
      value: '수정하기',
    });
    navigate(ROUTES.ClubEdit({ id: String(id), isLink: true }));
  };
  const handleMandateClick = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_category: 'click',
      event_label: 'club_delegation_authority',
      value: '권한위임',
    });
    openMandateModal();
  };

  const handleNavClick = (navValue:string) => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_category: 'click',
      event_label: 'club_tab_select',
      value: `${navValue}`,
    });
    setNavType(navValue);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('success', '전화번호가 복사되었습니다.');
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
      showToast('success', '전화번호가 복사되었습니다.');
    }
  };
  return (
    <div className={styles.layout}>
      {!isMobile && (
      <div className={styles['club-detail__pc-header']}>
        상세소개
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
            {clubDetail.manager
              && (
              <button
                type="button"
                className={styles['club-detail__pc-header__button']}
                onClick={() => setIsEdit(true)}
              >
                상세 소개 수정하기
              </button>
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
                <img
                  className={styles['club-detail__summary__image']}
                  src={clubDetail.image_url}
                  alt={`${clubDetail.name} 동아리 이미지`}
                />
              ) : (
                <div className={styles['club-detail__image-placeholder']}>
                  <p>동아리 이미지가 없습니다.</p>
                </div>
              )}
            </div>
          )}
          {(isMobile && clubDetail.manager) && (
            <div className={styles['club-detail__edit-button__container']}>
              <button type="button" className={styles['club-detail__edit-button']} onClick={handleMandateClick}>
                권한 위임
              </button>
              <button type="button" className={styles['club-detail__edit-button']} onClick={handleEditClick}>
                수정하기
              </button>
            </div>
          )}
          <div className={cn({
            [styles['club-detail__summary__row']]: true,
            [styles['club-detail__summary__row--mobile']]: isMobile,
            [styles['club-detail__summary__row--manager']]: isMobile && clubDetail.manager,
          })}
          >
            <h1 className={styles['club-detail__summary__title']}>{clubDetail.name}</h1>
            {isMobile && (
            <button type="button" className={styles['club-detail__summary__like']} onClick={handleToggleLike}>
              {clubDetail.is_liked ? <LikeIcon /> : <NonLikeIcon />}
              {clubDetail.likes}
            </button>
            )}
          </div>
          <div className={styles['club-detail__summary__row']}>
            분과:
            {clubDetail.category}
            {' '}
            분과
          </div>
          <div className={styles['club-detail__summary__row']}>
            동아리 방 위치:
            {clubDetail.location}
          </div>
          <div className={styles['club-detail__summary__row']}>
            동아리 소개:
            {clubDetail.description}
          </div>
          <div className={styles['club-detail__summary__contacts']}>
            {clubDetail.instagram && (
            <div className={styles['club-detail__summary__contacts__row']}>
              인스타:
              {clubDetail.instagram && (
              <a
                href={`https://www.instagram.com/${clubDetail.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles['club-detail__summary__contacts__row__link']}
              >
                @
                {clubDetail.instagram}
              </a>
              )}
            </div>
            )}
            {clubDetail.google_form && (
            <div className={styles['club-detail__summary__contacts__row']}>
              구글폼:
              {clubDetail.google_form && (
              <a
                href={clubDetail.google_form}
                target="_blank"
                rel="noopener noreferrer"
                className={styles['club-detail__summary__contacts__row__link']}
              >
                {clubDetail.google_form}
              </a>
              )}
            </div>
            )}
            {clubDetail.open_chat && (
            <div className={styles['club-detail__summary__contacts__row']}>
              오픈채팅:
              {clubDetail.open_chat && (
              <a
                href={clubDetail.open_chat}
                target="_blank"
                rel="noopener noreferrer"
                className={styles['club-detail__summary__contacts__row__link']}
              >
                {clubDetail.open_chat}
              </a>
              )}
            </div>
            )}
            {clubDetail.phone_number && (
            <div className={styles['club-detail__summary__contacts__row']}>
              전화번호:
              <div className={styles['club-detail__summary__contacts__text']}>
                {clubDetail.phone_number && formatPhoneNumber(clubDetail.phone_number)}
                <button
                  className={styles['copy-button']}
                  type="button"
                  aria-label="복사붙여넣기 버튼"
                  onClick={() => handleCopy(clubDetail.phone_number!)}
                >
                  <CopyIcon />
                </button>
              </div>
            </div>
            )}
          </div>
        </div>
        {!isMobile && (
          <div className={styles['club-detail__summary__image-container']}>
            {(!isMobile && clubDetail.manager) && (
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
                <img
                  className={styles['club-detail__summary__image']}
                  src={clubDetail.image_url}
                  alt={`${clubDetail.name} 동아리 이미지`}
                />
              ) : (
                <div className={styles['club-detail__image-placeholder']}>
                  <p>동아리 이미지가 없습니다.</p>
                </div>
              )}
            </div>
            {!clubDetail.is_like_hidden && (
            <button type="button" className={styles['club-detail__like']} disabled={isPending} onClick={handleToggleLike}>
              {clubDetail.is_liked ? <LikeIcon /> : <NonLikeIcon />}
              <div className={styles['club-detail__like__text']}>
                좋아요
                {' '}
                {clubDetail.likes || 0}
                개
              </div>
            </button>
            )}
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
            [styles['nav-type--active']]: navType === 'Q&A',
          })}
          onClick={() => handleNavClick('Q&A')}
        >
          Q&A
        </button>
      </div>
      {isMobile && (
      <div className={styles['club-detail__mobile-button__container']}>
        {(isEdit && navType === '상세 소개') ? (
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
            {clubDetail.manager && navType === '상세 소개'
              && (
              <button
                type="button"
                className={styles['club-detail__mobile-button__button']}
                onClick={() => setIsEdit(true)}
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
        <ClubIntroduction
          isEdit={isEdit}
          introduction={introduction}
          setIntroduction={setIntroduction}
        />
      )}
      {navType === 'Q&A' && (
        <ClubQnA
          openModal={openModal}
          clubId={id}
          isManager={clubDetail.manager}
          openAuthModal={openAuthModal}
        />
      )}
      {isModalOpen && (
        <CreateQnAModal
          closeModal={closeModal}
          clubId={id}
        />
      )}
      {
        isMandateModalOpen && (
          <MandateClubManagerModal
            closeModal={closeMandateModal}
            clubId={id}
            clubName={clubDetail.name}
          />
        )
      }
      {
        isAuthModalOpen && <ClubAuthModal closeModal={closeAuthModal} />
      }
      {
        navType === 'Q&A' && (
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
        )
      }
    </div>
  );
}
