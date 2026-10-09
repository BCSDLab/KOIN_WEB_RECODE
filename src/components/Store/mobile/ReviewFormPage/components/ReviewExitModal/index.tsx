import CenterModal from 'components/Store/mobile/common/CenterModal';
import Button from 'components/ui/Button';

import styles from './ReviewExitModal.module.scss';

// KOIN_ORDER_WEBVIEW ReviewEditForm의 나가기 확인 모달 이전(그만하기 = 뒤로, 계속쓰기 = 닫기)
interface ReviewExitModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  onExit: () => void;
}

export default function ReviewExitModal({ isOpen, message, onClose, onExit }: ReviewExitModalProps) {
  return (
    <CenterModal isOpen={isOpen} onClose={onClose}>
      <div className={styles.exit}>
        <p className={styles.exit__message}>{message}</p>

        <div className={styles.exit__buttons}>
          <Button
            type="button"
            color="gray"
            size="lg"
            className={`${styles.exit__button} ${styles['exit__button--stop']}`}
            onClick={onExit}
          >
            그만하기
          </Button>
          <Button type="button" color="primary" size="lg" className={styles.exit__button} onClick={onClose}>
            계속쓰기
          </Button>
        </div>
      </div>
    </CenterModal>
  );
}
