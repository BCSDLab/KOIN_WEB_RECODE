import useDeleteLostItemArticle from 'pages/Articles/hooks/useDeleteLostItemArticles';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import GarbageCanIcon from 'assets/svg/Articles/garbage-can.svg';
import CloseIcon from 'assets/svg/Articles/close.svg';
import { useBodyScrollLock } from 'utils/hooks/ui/useBodyScrollLock';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import { useArticlesLogger } from 'pages/Articles/hooks/useArticlesLogger';
import { useNavigate } from 'react-router-dom';
import ROUTES from 'static/routes';
import styles from './DeleteModal.module.scss';

interface DeleteModalProps {
  articleId: number;
  closeDeleteModal: () => void;
}

export default function DeleteModal(
  { articleId, closeDeleteModal }: DeleteModalProps,
) {
  const isMobile = useMediaQuery();
  const navigate = useNavigate();
  const { mutate: deleteArticle } = useDeleteLostItemArticle();
  const { logFindUserDeleteConfirmClick } = useArticlesLogger();
  useEscapeKeyDown({ onEscape: closeDeleteModal });
  useBodyScrollLock();
  const { backgroundRef } = useOutsideClick({ onOutsideClick: closeDeleteModal });

  const handleConfirmDeleteClick = () => {
    logFindUserDeleteConfirmClick();
    deleteArticle(articleId);
    navigate(ROUTES.Articles(), { replace: true });
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
        <div className={styles.modal__title}>게시글을 삭제하시겠습니까?</div>
        <div className={styles.modal__buttons}>
          <button
            className={styles.buttons__delete}
            type="button"
            onClick={handleConfirmDeleteClick}
          >
            {!isMobile && <GarbageCanIcon />}
            {isMobile ? '확인' : '삭제하기'}
          </button>
          <button
            className={styles.buttons__cancel}
            type="button"
            onClick={closeDeleteModal}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
