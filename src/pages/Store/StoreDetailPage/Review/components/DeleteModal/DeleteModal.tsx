import { UseMutateFunction } from '@tanstack/react-query';
import { StoreDetailResponse } from 'api/store/entity';
import useLogger from 'utils/hooks/analytics/useLogger';
import styles from './DeleteModal.module.scss';

interface Props {
  close: () => void;
  deleteMyReview: UseMutateFunction;
  storeDetail: StoreDetailResponse;
}

export default function DeleteModal({ close, deleteMyReview, storeDetail }: Props) {
  const logger = useLogger();

  const loggingConfirmDeleteClick = () => {
    logger.actionEventClick({
      actionTitle: 'BUSINSESS',
      title: 'shop_detail_view_review_delete_done',
      value: storeDetail.name,
      event_category: 'click',
    });
  };
  const loggingCancelDeleteClick = () => {
    logger.actionEventClick({
      actionTitle: 'BUSINSESS',
      title: 'shop_detail_view_review_delete_cancel',
      value: storeDetail.name,
      event_category: 'click',
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <div className={styles.modal__title}>
          리뷰를 <span>삭제</span> 하시겠습니까?
        </div>
        <div className={styles.modal__description}>삭제한 리뷰를 되돌릴 수 없습니다.</div>
        <div className={styles.modal__button}>
          <button
            type="button"
            onClick={() => {
              loggingCancelDeleteClick();
              close();
            }}
          >
            취소하기
          </button>
          <button
            type="button"
            onClick={() => {
              deleteMyReview();
              loggingConfirmDeleteClick();
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
