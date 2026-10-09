import CenterModal from 'components/Store/mobile/common/CenterModal';
import Button from 'components/ui/Button';

import styles from './DeleteReviewModal.module.scss';

// KOIN_ORDER_WEBVIEW ReviewCard의 삭제 확인 모달 이전
interface DeleteReviewModalProps {
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteReviewModal({ isOpen, isPending, onClose, onCancel, onConfirm }: DeleteReviewModalProps) {
  return (
    <CenterModal isOpen={isOpen} onClose={onClose}>
      <div className={styles.delete}>
        <p className={styles.delete__message}>
          삭제한 리뷰는 되돌릴 수 없습니다. <br /> 삭제 하시겠습니까?
        </p>
        <div className={styles.delete__buttons}>
          <Button type="button" color="gray" size="lg" className={styles.delete__button} onClick={onCancel}>
            취소
          </Button>
          <Button
            type="button"
            color="primary"
            size="lg"
            className={styles.delete__button}
            onClick={onConfirm}
            state={isPending ? 'disabled' : 'default'}
          >
            삭제하기
          </Button>
        </div>
      </div>
    </CenterModal>
  );
}
