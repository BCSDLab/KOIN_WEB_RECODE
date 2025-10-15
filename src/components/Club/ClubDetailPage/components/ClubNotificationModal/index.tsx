import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
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

  const { backgroundRef } = useOutsideClick({ onOutsideClick: closeModal });
  useEscapeKeyDown({ onEscape: closeModal });

  const handleSubmit = async () => {
    onSubmit();
    closeModal();
  };

  const notifyType = variant === 'recruit' ? '모집' : '행사';

  return (
    <div className={styles['modal-background']} ref={backgroundRef}>
      <div className={styles.modal}>
        {type === 'subscribed' && (
          <>
            <div className={styles['info-text']}>{notifyType} 알림을 받으시겠어요?</div>
            <div className={styles['info-button-container']}>
              <button className={styles['info-button__cancel']} type="button" onClick={closeModal}>취소하기</button>
              <button className={styles['info-button__confirm']} type="button" onClick={handleSubmit}>알림 받기</button>
            </div>
          </>
        )}
        {type === 'unsubscribed' && (
          <>
            <div className={styles['info-text']}>{notifyType} 알림을 취소하시겠어요?</div>
            <div className={styles['info-button-container']}>
              <button className={styles['info-button__cancel']} type="button" onClick={closeModal}>취소하기</button>
              <button className={styles['info-button__confirm']} type="button" onClick={handleSubmit}>알림 취소</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
