import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import styles from './ConfirmModal.module.scss';

interface ConfirmModalProps {
  closeModal: () => void;
  type?: string;
}

export default function ConfirmModal({ closeModal, type = 'confirm' }: ConfirmModalProps) {
  const isMobile = useMediaQuery();
  const { backgroundRef } = useOutsideClick({ onOutsideClick: closeModal });
  useEscapeKeyDown({ onEscape: closeModal });

  return (
    <div className={styles['modal-background']} ref={backgroundRef}>
      <div className={styles.modal}>
        {type === 'confirm' && (
          <>
            {isMobile ? (
              <>
                <div className={styles['info-text']}>작성하신 내용으로</div>
                <div className={styles['info-text']}>생성하시겠어요?</div>
              </>
            ) : (
              <>
                <h1 className={styles['modal-title']}>생성 확인</h1>
                <div className={styles['info-text']}>작성하신 내용으로 생성하시겠어요?</div>
              </>
            )}
            <div className={styles['info-button-container']}>
              <button className={styles['info-button__cancel']} type="button" onClick={closeModal}>취소</button>
              <button className={styles['info-button__confirm']} type="button" onClick={() => {}}>생성하기</button>
            </div>
          </>
        )}
        {type === 'cancel' && (
          <>
            {isMobile ? (
              <>
                <div className={styles['info-text']}>생성을 취소하시겠어요?</div>
                <div className={styles['info-text']}>작성하신 내용은 모두 사라져요.</div>
              </>
            ) : (
              <>
                <h1 className={styles['modal-title']}>생성 취소</h1>
                <div className={styles['info-text']}>생성을 취소하시겠어요?</div>
                <div className={styles['info-text']}>작성하신 내용은 모두 사라져요.</div>
              </>
            )}
            <div className={styles['info-button-container']}>
              <button className={styles['info-button__cancel']} type="button" onClick={closeModal}>취소</button>
              <button className={styles['info-button__reset']} type="button" onClick={() => {}}>삭제하기</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
