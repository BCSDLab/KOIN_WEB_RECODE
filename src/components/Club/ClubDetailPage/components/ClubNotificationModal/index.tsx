import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import useTokenState from 'utils/hooks/state/useTokenState';
import LoginRequiredModal from 'components/modal/LoginRequiredModal';
import styles from './ClubNotificationModal.module.scss';

interface ClubNotificationModalProps {
  closeModal: () => void;
  onSubmit: () => void;
  variant: 'recruit' | 'event';
  type?: 'subscribed' | 'unsubscribed';
}

export default function ClubNotificationModal({
  closeModal, onSubmit, variant, type = 'subscribed',
}: ClubNotificationModalProps) {
  const token = useTokenState();

  const notifyType = variant === 'recruit' ? '모집' : '행사';
  const infoText = `${notifyType} 알림을 ${type === 'unsubscribed' ? '취소하시겠어요?' : '받으시겠어요?'}`;
  const confirmText = type === 'unsubscribed' ? '알림 취소' : '알림 받기';

  if (!token) {
    return (
      <LoginRequiredModal
        title={`${notifyType} 알림 기능을 사용하기`}
        description={`동아리 ${notifyType} 알림 기능은 로그인이 필요한 서비스입니다.`}
        onClose={closeModal}
      />
    );
  }

  useEscapeKeyDown({ onEscape: closeModal });
  const { backgroundRef } = useOutsideClick({ onOutsideClick: closeModal });

  const handleSubmit = () => {
    onSubmit();
    closeModal();
  };

  return (
    <div className={styles['modal-background']} ref={backgroundRef}>
      <div className={styles.modal}>
        <div className={styles['info-text']}>{infoText}</div>
        <div className={styles['info-button-container']}>
          <button className={styles['info-button__cancel']} type="button" onClick={closeModal}>
            취소하기
          </button>
          <button className={styles['info-button__confirm']} type="button" onClick={handleSubmit}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
