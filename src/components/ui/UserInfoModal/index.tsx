import { lazy } from 'react';
import { useRouter } from 'next/router';
import waveHandAnimation from 'assets/lottie/waveHand.json';
import CloseIcon from 'assets/svg/close-icon-grey.svg';
import ROUTES from 'static/routes';
import useUserInfoModal from './hooks/useUserInfoModal';
import styles from './UserInfoModal.module.scss';

const Lottie = lazy(() => import('lottie-react'));

function UserInfoModal() {
  const router = useRouter();
  const { isModalOpen, showCloseButton, handleSkipModal, closeModal } = useUserInfoModal();

  if (!isModalOpen) {
    return null;
  }

  const handleNavigateToModifyInfo = () => {
    router.push(ROUTES.AuthModifyInfo());
    closeModal();
  };

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        {showCloseButton && (
          <button type="button" className={styles.closeButton} onClick={handleSkipModal} aria-label="모달 닫기">
            <CloseIcon />
          </button>
        )}

        <div className={styles.content}>
          <div className={styles.lottieContainer}>
            <Lottie animationData={waveHandAnimation} style={{ width: '100%', height: '100%' }} loop autoplay />
          </div>

          <div className={styles.notice}>
            <h4 className={styles.notice__title}>새로워진 코인, 준비 완료!</h4>
            <div className={styles.notice__description}>
              <div>몇 가지 정보만 더 입력해주시면</div>
              <div>더 편하고 똑똑하게 이용하실 수 있어요!</div>
            </div>
          </div>

          <button type="button" className={styles.actionButton} onClick={handleNavigateToModifyInfo}>
            정보 입력하러 가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserInfoModal;
