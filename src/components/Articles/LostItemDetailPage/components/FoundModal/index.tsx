import WarningIcon from 'assets/svg/Login/warning.svg';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import { useBodyScrollLock } from 'utils/hooks/ui/useBodyScrollLock';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import styles from './FoundModal.module.scss';

interface FoundModalProps {
  onConfirm: () => void;
  onClose: () => void;
  isPending: boolean;
}

export default function FoundModal({ onConfirm, onClose, isPending }: FoundModalProps) {
  const isMobile = useMediaQuery();
  useEscapeKeyDown({ onEscape: onClose });
  useBodyScrollLock();
  const { backgroundRef } = useOutsideClick({ onOutsideClick: onClose });

  const handleConfirmClick = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className={styles.background} ref={backgroundRef}>
      <div className={styles.modal}>
        {isMobile ? (
          <div className={styles.modal__title}>
            <div>상태 변경 시 되돌릴 수 없습니다.</div>
            <div>찾음으로 변경하시겠습니까?</div>
          </div>
        ) : (
          <>
            <div className={styles.modal__title}>
              <div>&apos;찾음&apos; 상태로</div>
              <div>변경하시겠습니까?</div>
            </div>
            <div className={styles.modal__warning}>
              <WarningIcon />
              <div>상태 변경 시 되돌릴 수 없습니다.</div>
            </div>
          </>
        )}
        <div className={styles.modal__buttons}>
          <button className={styles.buttons__confirm} type="button" onClick={handleConfirmClick} disabled={isPending}>
            변경하기
          </button>
          <button className={styles.buttons__cancel} type="button" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
