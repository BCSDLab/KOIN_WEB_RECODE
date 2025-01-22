import useDeleteLostItemArticle from 'pages/Articles/hooks/useDeleteLostItemArticles';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import GarbageCanIcon from 'assets/svg/Notice/garbage-can.svg';
import CloseIcon from 'assets/svg/Notice/close.svg';
import { useBodyScrollLock } from 'utils/hooks/ui/useBodyScrollLock';
import styles from './DeleteModal.module.scss';

interface DeleteModalProps {
  boardId: number;
  closeDeleteModal: () => void;
}

export default function DeleteModal(
  { boardId, closeDeleteModal }: DeleteModalProps,
) {
  const { mutate: deleteArticle } = useDeleteLostItemArticle(boardId);
  useEscapeKeyDown({ onEscape: closeDeleteModal });
  useBodyScrollLock();
  const { backgroundRef } = useOutsideClick({ onOutsideClick: closeDeleteModal });

  return (
    <div className={styles.background} ref={backgroundRef}>
      <div className={styles.modal}>
        <div
          className={styles.modal__close}
        >
          <button
            type="button"
            onClick={closeDeleteModal}
            aria-label="닫기"
          >
            <CloseIcon />
          </button>
        </div>
        <div className={styles.modal__title}>게시글을 삭제하시겠습니까?</div>
        <div className={styles.modal__buttons}>
          <button
            className={styles.buttons__delete}
            type="button"
            onClick={closeDeleteModal}
          >
            <GarbageCanIcon />
            삭제하기
          </button>
          <button
            className={styles.buttons__cancel}
            type="button"
            onClick={() => deleteArticle()}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
