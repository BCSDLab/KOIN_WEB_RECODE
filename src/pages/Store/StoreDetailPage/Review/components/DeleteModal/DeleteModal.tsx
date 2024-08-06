import { UseMutateFunction } from '@tanstack/react-query';
import styles from './DeleteModal.module.scss';

interface Props {
  close: () => void;
  deleteMyReview: UseMutateFunction
}

export default function DeleteModal({ close, deleteMyReview }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <div className={styles.modal__title}>리뷰를 삭제 하시겠습니까?</div>
        <div className={styles.modal__description}>삭제한 리뷰를 되돌릴 수 없습니다.</div>
        <div className={styles.modal__button}>
          <button type="button" onClick={close}>취소하기</button>
          <button
            type="button"
            onClick={() => {
              deleteMyReview();
              close();
            }}
          >
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
}
