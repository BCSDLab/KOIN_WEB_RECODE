import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import CloseIcon from 'assets/svg/Articles/close.svg';
import { useBodyScrollLock } from 'utils/hooks/ui/useBodyScrollLock';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useDeleteLostItemChatroom from './hooks/useBlockLostItemChatroom';
import styles from './DeleteModal.module.scss';

interface DeleteModalProps {
  articleId: number;
  chatroomId: number;
  closeDeleteModal: () => void;
}

export default function DeleteModal(
  { articleId, chatroomId, closeDeleteModal }: DeleteModalProps,
) {
  const isMobile = useMediaQuery();
  const { mutate: blockChatroom } = useDeleteLostItemChatroom();

  useEscapeKeyDown({ onEscape: closeDeleteModal });
  useBodyScrollLock();
  const { backgroundRef } = useOutsideClick({ onOutsideClick: closeDeleteModal });

  const handleConfirmDeleteClick = () => {
    blockChatroom({ articleId, chatroomId });
    closeDeleteModal();
  };

  return (
    <div className={styles.background} ref={backgroundRef}>
      <div className={styles.modal}>
        {!isMobile && (
          <div className={styles.modal__close}>
            <button
              type="button"
              onClick={closeDeleteModal}
              aria-label="닫기"
            >
              <CloseIcon />
            </button>
          </div>
        )}
        <div className={styles.modal__title}>
          <div>이 사용자를 차단하시겠습니까?</div>
          <div>쪽지 수신 및 발신이 모두 차단됩니다.</div>
        </div>
        <div className={styles.modal__buttons}>
          <button
            className={styles.buttons__delete}
            type="button"
            onClick={handleConfirmDeleteClick}
          >
            {isMobile ? '확인' : '차단하기'}
          </button>
          <button
            className={styles.buttons__cancel}
            type="button"
            onClick={closeDeleteModal}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
